import { getBackground } from './backgrounds'

export interface IconConfig {
  imageUrl: string
  backgroundId: string
  padding: number
  borderRadius: number
  size: number
  transparentBg?: boolean
}

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.trim().replace(/^#/, '')
  const r = parseInt(normalized.slice(0, 2), 16) || 0
  const g = parseInt(normalized.slice(2, 4), 16) || 0
  const b = parseInt(normalized.slice(4, 6), 16) || 0
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const generateIconDataUrl = async (config: IconConfig): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      canvas.width = config.size
      canvas.height = config.size

      if (!config.transparentBg) {
        const bg = getBackground(config.backgroundId)
        const radius = (config.borderRadius / 100) * config.size

        ctx.beginPath()
        ctx.moveTo(radius, 0)
        ctx.lineTo(config.size - radius, 0)
        ctx.quadraticCurveTo(config.size, 0, config.size, radius)
        ctx.lineTo(config.size, config.size - radius)
        ctx.quadraticCurveTo(config.size, config.size, config.size - radius, config.size)
        ctx.lineTo(radius, config.size)
        ctx.quadraticCurveTo(0, config.size, 0, config.size - radius)
        ctx.lineTo(0, radius)
        ctx.quadraticCurveTo(0, 0, radius, 0)
        ctx.closePath()
        ctx.clip()

        if (bg.type === 'solid') {
          ctx.fillStyle = bg.colors[0]
          ctx.fill()
        } else if (bg.type === 'linear') {
          const g = ctx.createLinearGradient(0, 0, config.size, config.size)
          g.addColorStop(0, bg.colors[0])
          g.addColorStop(1, bg.colors[1])
          ctx.fillStyle = g
          ctx.fill()
        } else if (bg.type === 'radial') {
          const g = ctx.createRadialGradient(config.size/2, config.size/2, 0, config.size/2, config.size/2, config.size)
          g.addColorStop(0, bg.colors[0])
          g.addColorStop(1, bg.colors[1])
          ctx.fillStyle = g
          ctx.fill()
        } else if (bg.type === 'dots') {
          ctx.fillStyle = bg.colors[0]
          ctx.fill()
          ctx.fillStyle = bg.colors[1]
          const spacing = (bg.params?.spacing || 20) * (config.size / 200)
          const dotRadius = (bg.params?.radius || 2) * (config.size / 200)
          for (let x = 0; x < config.size + spacing; x += spacing) {
            for (let y = 0; y < config.size + spacing; y += spacing) {
              ctx.beginPath()
              ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        } else if (bg.type === 'grid') {
          ctx.fillStyle = bg.colors[0]
          ctx.fill()
          ctx.strokeStyle = bg.colors[1]
          const spacing = (bg.params?.spacing || 20) * (config.size / 200)
          ctx.lineWidth = Math.max(1, (bg.params?.thickness || 1) * (config.size / 200))
          ctx.beginPath()
          for (let x = 0; x < config.size; x += spacing) {
            ctx.moveTo(x, 0)
            ctx.lineTo(x, config.size)
          }
          for (let y = 0; y < config.size; y += spacing) {
            ctx.moveTo(0, y)
            ctx.lineTo(config.size, y)
          }
          ctx.stroke()
        } else if (bg.type === 'stripes') {
          ctx.fillStyle = bg.colors[0]
          ctx.fill()
          ctx.fillStyle = bg.colors[1]
          const spacing = (bg.params?.spacing || 18) * (config.size / 200)
          const thickness = (bg.params?.thickness || 6) * (config.size / 200)
          for (let k = -config.size; k < config.size * 2; k += spacing) {
            ctx.beginPath()
            ctx.moveTo(k, 0)
            ctx.lineTo(k + config.size, config.size)
            ctx.lineTo(k + config.size + thickness, config.size)
            ctx.lineTo(k + thickness, 0)
            ctx.closePath()
            ctx.fill()
          }
        } else if (bg.type === 'spotlight') {
          const cx = (bg.params?.cx ?? 0.25) * config.size
          const cy = (bg.params?.cy ?? 0.2) * config.size
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, config.size)
          g.addColorStop(0, bg.colors[0])
          g.addColorStop(1, bg.colors[1])
          ctx.fillStyle = g
          ctx.fill()
        } else if (bg.type === 'accent') {
          ctx.fillStyle = bg.colors[0]
          ctx.fill()
          const band = bg.params?.band
          if (typeof band === 'number') {
            const w = Math.max(0.05, Math.min(0.5, band)) * config.size
            ctx.fillStyle = bg.colors[1]
            ctx.beginPath()
            ctx.moveTo(config.size * 0.15, 0)
            ctx.lineTo(config.size * 0.15 + w, 0)
            ctx.lineTo(config.size, config.size * 0.85 + w)
            ctx.lineTo(config.size, config.size * 0.85)
            ctx.closePath()
            ctx.fill()
          } else {
            const cx = (bg.params?.cx ?? 0.15) * config.size
            const cy = (bg.params?.cy ?? 0.15) * config.size
            const r = (bg.params?.r ?? 0.55) * config.size
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
            g.addColorStop(0, bg.colors[1])
            g.addColorStop(1, bg.colors[0])
            ctx.fillStyle = g
            ctx.fill()
          }
        } else if (bg.type === 'confetti') {
          ctx.fillStyle = bg.colors[0]
          ctx.fill()
          ctx.fillStyle = bg.colors[1]
          const density = Math.max(0, Math.min(0.2, bg.params?.density ?? 0.06))
          const seed = bg.params?.seed ?? 1337
          const dotRadius = Math.max(0.8, config.size / 220)
          const step = Math.max(6, Math.floor(config.size / 28))
          for (let x = 0; x < config.size; x += step) {
            for (let y = 0; y < config.size; y += step) {
              const h = ((x * 73856093) ^ (y * 19349663) ^ seed) >>> 0
              if ((h % 1000) / 1000 > density) continue
              ctx.beginPath()
              ctx.arc(x + (h % step), y + ((h >>> 8) % step), dotRadius, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        } else if (bg.type === 'glass') {
          ctx.fillStyle = bg.colors[0]
          ctx.fill()
          const gTop = ctx.createLinearGradient(0, 0, 0, config.size * 0.4)
          gTop.addColorStop(0, bg.colors[1])
          gTop.addColorStop(1, bg.colors[1].replace(/[\d.]+\)$/g, '0)'))
          ctx.fillStyle = gTop
          ctx.fill()
          const gBot = ctx.createRadialGradient(config.size/2, config.size, 0, config.size/2, config.size, config.size * 0.7)
          gBot.addColorStop(0, bg.colors[2])
          gBot.addColorStop(1, bg.colors[2].replace(/[\d.]+\)$/g, '0)'))
          ctx.fillStyle = gBot
          ctx.fill()
        } else if (bg.type === 'mesh') {
          ctx.fillStyle = bg.colors[0]
          ctx.fill()
          const corners = [
            { x: 0, y: 0, c: bg.colors[0] },
            { x: config.size, y: 0, c: bg.colors[1] },
            { x: config.size, y: config.size, c: bg.colors[2] },
            { x: 0, y: config.size, c: bg.colors[3] }
          ]
          corners.forEach(corner => {
            const g = ctx.createRadialGradient(corner.x, corner.y, 0, corner.x, corner.y, config.size * 0.8)
            g.addColorStop(0, corner.c)
            g.addColorStop(1, corner.c.startsWith('#') ? hexToRgba(corner.c, 0) : corner.c.replace(/[\d.]+\)$/g, '0)'))
            ctx.fillStyle = g
            ctx.fill()
          })
        } else if (bg.type === 'noise') {
          ctx.fillStyle = bg.colors[0]
          ctx.fill()
          const imgData = ctx.getImageData(0, 0, config.size, config.size)
          const data = imgData.data
          const intensity = bg.params?.intensity || 20
          for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * (intensity / 100) * 255
            data[i] = Math.min(255, Math.max(0, data[i] + noise))
            data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise))
            data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise))
          }
          ctx.putImageData(imgData, 0, 0)
        } else if (bg.type === 'checkerboard') {
          ctx.fillStyle = bg.colors[0]
          ctx.fill()
          ctx.fillStyle = bg.colors[1]
          const size = (bg.params?.size || 20) * (config.size / 200)
          for (let y = 0; y < config.size; y += size) {
            for (let x = 0; x < config.size; x += size) {
              if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
                ctx.fillRect(x, y, size, size)
              }
            }
          }
        }
      }

      const padPx = (config.padding / 100) * config.size
      const drawSize = config.size - (padPx * 2)

      const imgRatio = img.width / img.height
      let drawW = drawSize
      let drawH = drawSize

      if (imgRatio > 1) {
        drawH = drawSize / imgRatio
      } else {
        drawW = drawSize * imgRatio
      }

      const x = (config.size - drawW) / 2
      const y = (config.size - drawH) / 2

      ctx.drawImage(img, x, y, drawW, drawH)
      
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = config.imageUrl
  })
}
