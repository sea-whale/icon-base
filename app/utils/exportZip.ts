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
  const promises = ICONS.map(async (icon) => {
    const dataUrl = await generateIconDataUrl({
      ...config,
      size: icon.size,
      transparentBg: false
    })
    
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "")
    zip.file(icon.name, base64Data, { base64: true })
  })

  // Add a manifest.json or browserconfig.xml
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

  await Promise.all(promises)
  
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'logowear-icons.zip')
}
