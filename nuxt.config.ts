// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@nuxtjs/sitemap'],
  nitro: {
    prerender: {
      routes: [
        '/',
        '/ios-app-icon-generator',
        '/favicon-maker',
        '/mac-os-icon-creator',
        '/zh',
        '/zh/ios-app-icon-generator',
        '/zh/favicon-maker',
        '/zh/mac-os-icon-creator',
        '/ja',
        '/ja/ios-app-icon-generator',
        '/ja/favicon-maker',
        '/ja/mac-os-icon-creator',
        '/ko',
        '/ko/ios-app-icon-generator',
        '/ko/favicon-maker',
        '/ko/mac-os-icon-creator',
        '/de',
        '/de/ios-app-icon-generator',
        '/de/favicon-maker',
        '/de/mac-os-icon-creator',
        '/fr',
        '/fr/ios-app-icon-generator',
        '/fr/favicon-maker',
        '/fr/mac-os-icon-creator',
        '/ru',
        '/ru/ios-app-icon-generator',
        '/ru/favicon-maker',
        '/ru/mac-os-icon-creator',
        '/sitemap.xml'
      ]
    }
  },
  sitemap: {
    autoLastmod: false,
    discoverImages: false,
    discoverVideos: false,
    credits: false,
    xsl: false
  },
  i18n: {
    baseUrl: 'https://iconbase.7-image.com',
    locales: [
      { code: 'en', iso: 'en-US', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'zh', iso: 'zh-CN', language: 'zh-CN', file: 'zh.json', name: '中文' },
      { code: 'ja', iso: 'ja-JP', language: 'ja-JP', file: 'ja.json', name: '日本語' },
      { code: 'ko', iso: 'ko-KR', language: 'ko-KR', file: 'ko.json', name: '한국어' },
      { code: 'de', iso: 'de-DE', language: 'de-DE', file: 'de.json', name: 'Deutsch' },
      { code: 'fr', iso: 'fr-FR', language: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'ru', iso: 'ru-RU', language: 'ru-RU', file: 'ru.json', name: 'Русский' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'iconbase_i18n_redirected',
      redirectOn: 'root'
    },
    lazy: false,
    langDir: '../locales'
  },
  app: {
    head: {
      script: [
        ...(process.env.NODE_ENV === 'production' ? [
          {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-4F9P0R922R',
            async: true
          },
          {
            innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-4F9P0R922R');`
          }
        ] : [])
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'google-site-verification', content: 'bX16LW08pjYPNP25MJNDg5TvTGRolaSj_XVlvWNMSJE'},
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
      ]
    }
  }
})
