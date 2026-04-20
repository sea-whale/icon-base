import { getBackground } from './backgrounds'

export interface IconConfig {
  imageUrl: string
  backgroundId: string
  padding: number // 0-50 percentage
  borderRadius: number // 0-50 percentage
  size: number // Target width/height in px
  transparentBg?: boolean // if true, don't draw the background color
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

      // Draw background with border radius
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
        }
      }

      // Calculate padding and image placement
      const padPx = (config.padding / 100) * config.size
      const drawSize = config.size - (padPx * 2)
      
      // Keep aspect ratio
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