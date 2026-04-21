<script setup lang="ts">
import { useHead, useLocaleHead } from '#imports'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import { SITE_DOMAIN, SITE_NAME } from '../utils/site'

const i18nHead = useLocaleHead({
  dir: true,
  lang: true,
  seo: true
})

useHead(() => ({
  titleTemplate: (title) => {
    if (!title) return SITE_NAME
    return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  },
  htmlAttrs: {
    ...i18nHead.value.htmlAttrs
  },
  bodyAttrs: {
    class: 'antialiased bg-[#fbfbfd] text-slate-900 min-h-screen'
  },
  link: [
    ...(i18nHead.value.link || []),
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/logo.png' }
  ],
  meta: [
    ...(i18nHead.value.meta || []),
    { name: 'theme-color', content: '#536350' },
    { name: 'application-name', content: SITE_NAME },
    { name: 'apple-mobile-web-app-title', content: SITE_NAME },
    { property: 'og:site_name', content: SITE_NAME }
  ]
}))
</script>

<template>
  <div class="min-h-screen font-sans">
    <div
      class="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.18),rgba(59,130,246,0)_70%),radial-gradient(40%_40%_at_15%_15%,rgba(236,72,153,0.14),rgba(236,72,153,0)_70%),radial-gradient(35%_35%_at_90%_20%,rgba(16,185,129,0.12),rgba(16,185,129,0)_70%)] pointer-events-none">
    </div>

    <SiteHeader />

    <main class="relative z-10">
      <slot />
    </main>

    <SiteFooter :domain="SITE_DOMAIN" />
  </div>
</template>
