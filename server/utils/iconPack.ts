import Jimp from 'jimp'

const parseHexColor = (hex: string) => {
  const normalized = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return 0x000000ff
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  return Jimp.rgbaToInt(r, g, b, 255)
}

const applyRoundedCorners = (image: Jimp, radiusPx: number) => {
  const w = image.bitmap.width
  const h = image.bitmap.height
  const r = Math.max(0, Math.min(Math.floor(radiusPx), Math.min(w, h) / 2))
  if (r === 0) return

  const adjustCorner = (ox: number, oy: number, sx: 1 | -1, sy: 1 | -1) => {
    const x0 = sx === 1 ? ox : ox - r
    const y0 = sy === 1 ? oy : oy - r

    image.scan(x0, y0, r, r, (x, y, idx) => {
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
  const mime = match[1]
  const base64 = match[2]
  return { mime, buffer: Buffer.from(base64, 'base64') }
}

export interface IconJob {
  imageDataUrl: string
  backgroundColor: string
  padding: number
  borderRadius: number
  size: number
}

export const renderIconPng = async (job: IconJob) => {
  const decoded = decodeDataUrl(job.imageDataUrl)
  if (!decoded) throw new Error('Invalid imageDataUrl')
  if (decoded.mime === 'image/svg+xml') throw new Error('SVG is not supported in server mode')

  const src = await Jimp.read(decoded.buffer)
  const size = Math.max(16, Math.min(2048, Math.floor(job.size)))
  const padPx = Math.max(0, Math.min(0.5, job.padding / 100)) * size
  const target = size - padPx * 2
  const bg = new Jimp({ width: size, height: size, color: parseHexColor(job.backgroundColor) })

  const ratio = src.bitmap.width / src.bitmap.height
  let drawW = target
  let drawH = target
  if (ratio > 1) drawH = target / ratio
  else drawW = target * ratio

  const resized = src.clone().resize({ w: Math.max(1, Math.round(drawW)), h: Math.max(1, Math.round(drawH)) })
  const x = Math.round((size - resized.bitmap.width) / 2)
  const y = Math.round((size - resized.bitmap.height) / 2)
  bg.composite(resized, x, y)

  applyRoundedCorners(bg, (job.borderRadius / 100) * size)
  return bg.getBufferAsync(Jimp.MIME_PNG)
}
