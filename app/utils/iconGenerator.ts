export interface IconConfig {
  imageUrl: string
  backgroundColor: string
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
        ctx.fillStyle = config.backgroundColor
        
        // Handle border radius
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
        ctx.fill()
        
        // Clip to the border radius for the image as well, just in case
        ctx.clip()
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