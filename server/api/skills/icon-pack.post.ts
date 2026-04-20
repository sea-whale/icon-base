import { createError, readBody, setHeader } from 'h3'
import JSZip from 'jszip'
import { requireUserIdFromApiKey } from '../../utils/auth'
import { renderIconPng } from '../../utils/iconPack'

const DEFAULT_ICONS = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'icon-maskable-512x512.png', size: 512 },
  { name: 'desktop-256x256.png', size: 256 },
  { name: 'desktop-1024x1024.png', size: 1024 }
]

export default defineEventHandler(async (event) => {
  await requireUserIdFromApiKey(event)

  const body = await readBody<{
    imageDataUrl?: string
    backgroundColor?: string
    padding?: number
    borderRadius?: number
    icons?: Array<{ name: string; size: number }>
    responseType?: 'json' | 'binary'
  }>(event)

  const imageDataUrl = body.imageDataUrl || ''
  const backgroundColor = body.backgroundColor || '#000000'
  const padding = typeof body.padding === 'number' ? body.padding : 20
  const borderRadius = typeof body.borderRadius === 'number' ? body.borderRadius : 22.5
  const icons = Array.isArray(body.icons) && body.icons.length ? body.icons : DEFAULT_ICONS

  if (!imageDataUrl.startsWith('data:')) {
    throw createError({ statusCode: 400, statusMessage: 'imageDataUrl is required (data URL base64)' })
  }

  const zip = new JSZip()
  for (const icon of icons) {
    const png = await renderIconPng({
      imageDataUrl,
      backgroundColor,
      padding,
      borderRadius,
      size: icon.size
    })
    zip.file(icon.name, png)
  }

  zip.file(
    'site.webmanifest',
    JSON.stringify(
      {
        name: 'LogoWear App',
        short_name: 'LogoWear',
        icons: [
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        theme_color: backgroundColor,
        background_color: backgroundColor,
        display: 'standalone'
      },
      null,
      2
    )
  )

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

  if (body.responseType === 'binary') {
    setHeader(event, 'content-type', 'application/zip')
    setHeader(event, 'content-disposition', 'attachment; filename="logowear-icons.zip"')
    return zipBuffer
  }

  return {
    filename: 'logowear-icons.zip',
    mime: 'application/zip',
    base64: zipBuffer.toString('base64')
  }
})

