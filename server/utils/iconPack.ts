import { Jimp } from 'jimp'
import { getBackground } from './backgrounds'

const parseColor = (colorStr: string) => {
  if (colorStr.startsWith('rgba')) {
    const match = colorStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
    if (match) return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]), a: parseFloat(match[4]) }
  }
  const normalized = colorStr.trim().replace(/^#/, '')
  const r = parseInt(normalized.slice(0, 2), 16) || 0
  const g = parseInt(normalized.slice(2, 4), 16) || 0
  const b = parseInt(normalized.slice(4, 6), 16) || 0
  return { r, g, b, a: 1 }
}

const applyRoundedCorners = (image: any, radiusPx: number) => {
  const w = image.bitmap.width
  const h = image.bitmap.height
  const r = Math.max(0, Math.min(Math.floor(radiusPx), Math.min(w, h) / 2))
  if (r === 0) return

  const adjustCorner = (ox: number, oy: number, sx: 1 | -1, sy: 1 | -1) => {
    const x0 = sx === 1 ? ox : ox - r
    const y0 = sy === 1 ? oy : oy - r

    image.scan(x0, y0, r, r, (x: number, y: number, idx: number) => {
      const dx = sx === 1 ? (r - 1 - (x - x0)) : (x - x0)
      const dy = sy === 1 ? (r - 1 - (y - y0)) : (y - y0)
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= r - 1) return

      const baseAlpha = image.bitmap.data[idx + 3]
      if (dist >= r) {
        image.bitmap.data[idx + 3] = 0
        return
      }
      const t = Math.max(0, Math.min(1, r - dist))
      image.bitmap.data[idx + 3] = Math.round(baseAlpha * t)
    })
  }

  adjustCorner(0, 0, 1, 1)
  adjustCorner(w, 0, -1, 1)
  adjustCorner(0, h, 1, -1)
  adjustCorner(w, h, -1, -1)
}

const decodeDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return null
  let base64 = match[2]
  base64 = decodeURIComponent(base64).replace(/\s/g, '')
  return { mime: match[1], buffer: Buffer.from(base64, 'base64') }
}

export interface IconJob {
  imageDataUrl: string
  backgroundId: string
  padding: number
  borderRadius: number
  size: number
}

export const renderIconPng = async (job: IconJob) => {
  const decoded = decodeDataUrl(job.imageDataUrl)
  if (!decoded) throw new Error('Invalid imageDataUrl')
  if (decoded.mime === 'image/svg+xml') throw new Error('SVG is not supported in server mode')

  const src = await Jimp.read(Buffer.from(decoded.buffer))
  const size = Math.max(16, Math.min(2048, Math.floor(job.size)))
  const padPx = Math.max(0, Math.min(0.5, job.padding / 100)) * size
  const target = size - padPx * 2

  const bgConfig = getBackground(job.backgroundId)
  const c1 = parseColor(bgConfig.colors[0])
  const c2 = bgConfig.colors[1] ? parseColor(bgConfig.colors[1]) : c1
  const c3 = bgConfig.colors[2] ? parseColor(bgConfig.colors[2]) : c1
  const c4 = bgConfig.colors[3] ? parseColor(bgConfig.colors[3]) : c1

  const bg = new Jimp({ width: size, height: size, color: 0x00000000 })
  const spacing = (bgConfig.params?.spacing || 20) * (size / 200)
  const radius = (bgConfig.params?.radius || 2) * (size / 200)
  const thickness = Math.max(1, (bgConfig.params?.thickness || 1) * (size / 200))

  bg.scan(0, 0, size, size, (x: number, y: number, idx: number) => {
    let r = c1.r, g = c1.g, b = c1.b

    if (bgConfig.type === 'linear') {
      const t = (x + y) / (size * 2)
      r = c1.r + (c2.r - c1.r) * t
      g = c1.g + (c2.g - c1.g) * t
      b = c1.b + (c2.b - c1.b) * t
    } else if (bgConfig.type === 'radial') {
      const dx = x - size/2
      const dy = y - size/2
      const dist = Math.sqrt(dx*dx + dy*dy)
      const maxDist = size / 1.2
      const t = Math.max(0, Math.min(1, dist / maxDist))
      r = c1.r + (c2.r - c1.r) * t
      g = c1.g + (c2.g - c1.g) * t
      b = c1.b + (c2.b - c1.b) * t
    } else if (bgConfig.type === 'dots') {
      const nx = Math.round(x / spacing) * spacing
      const ny = Math.round(y / spacing) * spacing
      const dist = Math.sqrt((x - nx)**2 + (y - ny)**2)
      if (dist <= radius) {
        r = c2.r; g = c2.g; b = c2.b
      }
    } else if (bgConfig.type === 'grid') {
      if (x % spacing < thickness || y % spacing < thickness) {
        r = c2.r; g = c2.g; b = c2.b
      }
    } else if (bgConfig.type === 'checkerboard') {
      const checkerSize = (bgConfig.params?.size || 20) * (size / 200)
      if ((Math.floor(x / checkerSize) + Math.floor(y / checkerSize)) % 2 === 0) {
        r = c2.r; g = c2.g; b = c2.b
      }
    } else if (bgConfig.type === 'stripes') {
      const spacingStr = (bgConfig.params?.spacing || 18) * (size / 200)
      const thicknessStr = (bgConfig.params?.thickness || 6) * (size / 200)
      // Angle logic simplified to 45 deg or 135 deg for Jimp
      const dist = (x + y) % spacingStr
      if (dist < thicknessStr) {
        r = c2.r; g = c2.g; b = c2.b
      }
    } else if (bgConfig.type === 'spotlight') {
      const cx = (bgConfig.params?.cx ?? 0.25) * size
      const cy = (bgConfig.params?.cy ?? 0.2) * size
      const dist = Math.sqrt((x - cx)**2 + (y - cy)**2)
      const t = Math.max(0, Math.min(1, dist / size))
      r = c1.r + (c2.r - c1.r) * t
      g = c1.g + (c2.g - c1.g) * t
      b = c1.b + (c2.b - c1.b) * t
    } else if (bgConfig.type === 'accent') {
      const band = bgConfig.params?.band
      if (typeof band === 'number') {
        const w = Math.max(0.05, Math.min(0.5, band)) * size
        const start = size * 0.15
        const diag = (size - x) + y // simplified diagonal
        if (diag > start && diag < start + w * 2) {
          r = c2.r; g = c2.g; b = c2.b
        }
      } else {
        const cx = (bgConfig.params?.cx ?? 0.15) * size
        const cy = (bgConfig.params?.cy ?? 0.15) * size
        const rr = (bgConfig.params?.r ?? 0.55) * size
        const dist = Math.sqrt((x - cx)**2 + (y - cy)**2)
        if (dist <= rr) {
          const t = Math.max(0, Math.min(1, dist / rr))
          r = c2.r + (c1.r - c2.r) * t
          g = c2.g + (c1.g - c2.g) * t
          b = c2.b + (c1.b - c2.b) * t
        }
      }
    } else if (bgConfig.type === 'confetti') {
      const density = Math.max(0, Math.min(0.2, bgConfig.params?.density ?? 0.06))
      const seed = bgConfig.params?.seed ?? 1337
      const dotRadius = Math.max(0.8, size / 220)
      const step = Math.max(6, Math.floor(size / 28))
      const basex = Math.floor(x / step) * step
      const basey = Math.floor(y / step) * step
      const h = ((basex * 73856093) ^ (basey * 19349663) ^ seed) >>> 0
      if ((h % 1000) / 1000 <= density) {
        const dx = x - (basex + (h % step))
        const dy = y - (basey + ((h >>> 8) % step))
        if (dx*dx + dy*dy <= dotRadius*dotRadius) {
          r = c2.r; g = c2.g; b = c2.b
        }
      }
    } else if (bgConfig.type === 'noise') {
      const intensity = bgConfig.params?.intensity || 20
      const noise = (Math.random() - 0.5) * (intensity / 100) * 255
      r = Math.min(255, Math.max(0, r + noise))
      g = Math.min(255, Math.max(0, g + noise))
      b = Math.min(255, Math.max(0, b + noise))
    } else if (bgConfig.type === 'mesh') {
      const tx = x / size
      const ty = y / size
      r = c1.r * (1-tx)*(1-ty) + c2.r * tx*(1-ty) + c4.r * (1-tx)*ty + c3.r * tx*ty
      g = c1.g * (1-tx)*(1-ty) + c2.g * tx*(1-ty) + c4.g * (1-tx)*ty + c3.g * tx*ty
      b = c1.b * (1-tx)*(1-ty) + c2.b * tx*(1-ty) + c4.b * (1-tx)*ty + c3.b * tx*ty
    } else if (bgConfig.type === 'glass') {
      // top highlight
      const tTop = Math.max(0, Math.min(1, y / (size * 0.4)))
      const aTop = c2.a * (1 - tTop)
      r = r * (1 - aTop) + c2.r * aTop
      g = g * (1 - aTop) + c2.g * aTop
      b = b * (1 - aTop) + c2.b * aTop
      // bottom glow
      const dist = Math.sqrt((x - size/2)**2 + (y - size)**2)
      const tBot = Math.max(0, Math.min(1, dist / (size * 0.7)))
      const aBot = c3.a * (1 - tBot)
      r = r * (1 - aBot) + c3.r * aBot
      g = g * (1 - aBot) + c3.g * aBot
      b = b * (1 - aBot) + c3.b * aBot
    } else if (bgConfig.type === 'spotlight') {
      const cx = (bgConfig.params?.cx ?? 0.25) * size
      const cy = (bgConfig.params?.cy ?? 0.2) * size
      const dx = x - cx
      const dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = size * 1.1
      const t = Math.max(0, Math.min(1, dist / maxDist))
      r = c1.r + (c2.r - c1.r) * t
      g = c1.g + (c2.g - c1.g) * t
      b = c1.b + (c2.b - c1.b) * t
    } else if (bgConfig.type === 'accent') {
      const band = bgConfig.params?.band
      if (typeof band === 'number') {
        const w = Math.max(0.05, Math.min(0.5, band)) * size
        const v = x + y
        const start = size * 1.05 - w
        if (v >= start && v <= start + w) {
          r = c2.r; g = c2.g; b = c2.b
        }
      } else {
        const cx = (bgConfig.params?.cx ?? 0.15) * size
        const cy = (bgConfig.params?.cy ?? 0.15) * size
        const rr = (bgConfig.params?.r ?? 0.55) * size
        const dx = x - cx
        const dy = y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const t = Math.max(0, Math.min(1, dist / rr))
        r = c2.r + (c1.r - c2.r) * t
        g = c2.g + (c1.g - c2.g) * t
        b = c2.b + (c1.b - c2.b) * t
      }
    } else if (bgConfig.type === 'confetti') {
      const density = Math.max(0, Math.min(0.2, bgConfig.params?.density ?? 0.06))
      const seed = bgConfig.params?.seed ?? 1337
      const h = ((x * 73856093) ^ (y * 19349663) ^ seed) >>> 0
      if ((h & 1023) / 1023 < density && ((x + y) % 3 === 0)) {
        r = c2.r; g = c2.g; b = c2.b
      }
    }

    bg.bitmap.data[idx + 0] = Math.max(0, Math.min(255, Math.round(r)))
    bg.bitmap.data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)))
    bg.bitmap.data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)))
    bg.bitmap.data[idx + 3] = 255
  })

  const ratio = src.bitmap.width / src.bitmap.height
  let drawW = target
  let drawH = target
  if (ratio > 1) drawH = target / ratio
  else drawW = target * ratio

  const resized = src.resize({ w: Math.max(1, Math.round(drawW)), h: Math.max(1, Math.round(drawH)) })
  const x = Math.round((size - resized.bitmap.width) / 2)
  const y = Math.round((size - resized.bitmap.height) / 2)
  bg.composite(resized, x, y)

  applyRoundedCorners(bg, (job.borderRadius / 100) * size)
  return bg.getBuffer('image/png')
}
