export const SITE_NAME = 'IconBase'
export const SITE_URL = 'https://iconbase.7-image.com'
export const SITE_IMAGE = `${SITE_URL}/logo.png`
export const SITE_DOMAIN = 'iconbase.7-image.com'

export type SeoPageKey =
  | 'home'
  | 'ios-app-icon-generator'
  | 'favicon-maker'
  | 'mac-os-icon-creator'

export interface PageDefinition {
  path: string
  navKey: string
  defaultBackgroundId: string
  related: SeoPageKey[]
  softwareCategory: string
}

export const PAGE_DEFINITIONS: Record<SeoPageKey, PageDefinition> = {
  home: {
    path: '/',
    navKey: 'home',
    defaultBackgroundId: 'glass-green-glow',
    related: ['ios-app-icon-generator', 'favicon-maker', 'mac-os-icon-creator'],
    softwareCategory: 'DesignApplication'
  },
  'ios-app-icon-generator': {
    path: '/ios-app-icon-generator',
    navKey: 'ios',
    defaultBackgroundId: 'grad-lime',
    related: ['home', 'favicon-maker', 'mac-os-icon-creator'],
    softwareCategory: 'GraphicsApplication'
  },
  'favicon-maker': {
    path: '/favicon-maker',
    navKey: 'favicon',
    defaultBackgroundId: 'mesh-aurora',
    related: ['home', 'ios-app-icon-generator', 'mac-os-icon-creator'],
    softwareCategory: 'BrowserApplication'
  },
  'mac-os-icon-creator': {
    path: '/mac-os-icon-creator',
    navKey: 'mac',
    defaultBackgroundId: 'glass-obsidian',
    related: ['home', 'ios-app-icon-generator', 'favicon-maker'],
    softwareCategory: 'DesktopApplication'
  }
}

export const PAGE_ORDER = Object.keys(PAGE_DEFINITIONS) as SeoPageKey[]

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString()
