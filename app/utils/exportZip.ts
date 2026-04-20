import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { generateIconDataUrl } from './iconGenerator'
import { getBackground } from './backgrounds'

export interface ExportConfig {
  imageUrl: string
  backgroundId: string
  padding: number
  borderRadius: number
}

const ICONS = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'icon-maskable-512x512.png', size: 512 },
  { name: 'desktop-256x256.png', size: 256 },
  { name: 'desktop-1024x1024.png', size: 1024 }
]

export const generateAllIcons = async (config: ExportConfig) => {
  const zip = new JSZip()
  
  // 1. Generate standard PNG icons
  const promises = ICONS.map(async (icon) => {
    const dataUrl = await generateIconDataUrl({
      ...config,
      size: icon.size,
      transparentBg: false
    })
    
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "")
    zip.file(icon.name, base64Data, { base64: true })
  })
  
  await Promise.all(promises)

  // 2. Generate ICO file using the 32x32 icon canvas directly
  try {
    const icoDataUrl = await generateIconDataUrl({
      ...config,
      size: 32,
      transparentBg: false
    })
    const img = new Image()
    img.src = icoDataUrl
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
    
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, 32, 32)
      
      // Create ICO file format manually
      // ICO header (6 bytes)
      const header = new Uint8Array([0, 0, 1, 0, 1, 0])
      // Directory entry (16 bytes)
      const dir = new Uint8Array([
        32, 32, 0, 0, 1, 0, 32, 0,
        0, 0, 0, 0, // size of image data (to be filled)
        22, 0, 0, 0 // offset of image data
      ])
      
      // Generate PNG for the ICO body
      const pngBlob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'))
      if (pngBlob) {
        const pngBuffer = await pngBlob.arrayBuffer()
        const size = pngBuffer.byteLength
        new DataView(dir.buffer).setUint32(8, size, true) // fill size (little endian)
        
        const icoBlob = new Blob([header, dir, pngBuffer], { type: 'image/x-icon' })
        zip.file('favicon.ico', icoBlob)
      }
    }
  } catch (e) {
    console.error('Failed to generate ICO:', e)
  }

  // 3. Add a manifest.json
  const bgConfig = getBackground(config.backgroundId)
  const themeColor = bgConfig.colors[0]
  
  const webmanifest = {
    name: "My App",
    short_name: "App",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    theme_color: themeColor,
    background_color: themeColor,
    display: "standalone"
  }
  
  zip.file("site.webmanifest", JSON.stringify(webmanifest, null, 2))

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'logowear-icons.zip')
}
