import { Jimp } from 'jimp'
import { getBackground } from './backgrounds'

const parseHexToRGB = (hex: string) => {
  const normalized = hex.trim().replace(/^#/, '')
  const r = parseInt(normalized.slice(0, 2), 16) || 0
  const g = parseInt(normalized.slice(2, 4), 16) || 0
  const b = parseInt(normalized.slice(4, 6), 16) || 0
  return { r, g, b }
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
  const c1 = parseHexToRGB(bgConfig.colors[0])
  const c2 = bgConfig.colors[1] ? parseHexToRGB(bgConfig.colors[1]) : c1

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
    } else if (bgConfig.type === 'stripes') {
      const s = spacing || 18
      const t = Math.max(1, (bgConfig.params?.thickness || 6) * (size / 200))
      if (((x + y) % s) < t) {
        r = c2.r; g = c2.g; b = c2.b
      }
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
