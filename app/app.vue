<script setup lang="ts">
import { useAppConfig, useHead, useI18n } from '#imports'
import { computed, ref, provide } from 'vue'
import { Upload, Palette } from 'lucide-vue-next'
import ControlPanel from './components/ControlPanel.vue'
import PreviewGrid from './components/PreviewGrid.vue'
import ExportSection from './components/ExportSection.vue'

const { t, locale, setLocale } = useI18n()
const appConfig = useAppConfig()

useHead({
  title: 'LogoWear - Apple-Style Icon Generator',
  bodyAttrs: {
    class: 'antialiased bg-[#fbfbfd] text-slate-900 min-h-screen'
  }
})

// Global State
const uploadedImage = ref<string | null>('/logo.svg')
const backgroundId = ref<string>('glass-green-glow')
const padding = ref<number>(20)
const borderRadius = ref<number>(22.5)

const isDefaultImage = computed(() => uploadedImage.value === '/logo.svg')

// Provide state to components
provide('uploadedImage', uploadedImage)
provide('backgroundId', backgroundId)
provide('padding', padding)
provide('borderRadius', borderRadius)
provide('isDefaultImage', isDefaultImage)

const toggleLanguage = () => {
  setLocale(locale.value === 'zh' ? 'en' : 'zh')
}

const links = computed(() => ({
  x: appConfig.links?.x as string | undefined,
  github: appConfig.links?.github as string | undefined,
  blog: appConfig.links?.blog as string | undefined
}))
</script>

<template>
  <div class="min-h-screen font-sans">
    <div class="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.18),rgba(59,130,246,0)_70%),radial-gradient(40%_40%_at_15%_15%,rgba(236,72,153,0.14),rgba(236,72,153,0)_70%),radial-gradient(35%_35%_at_90%_20%,rgba(16,185,129,0.12),rgba(16,185,129,0)_70%)] pointer-events-none"></div>

    <header class="relative z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div class="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#" class="flex items-center gap-3">
          <img src="/logo.png" alt="LogoWear" class="w-8 h-8 rounded-lg shadow-sm object-cover" />
          <span class="text-[15px] font-semibold tracking-tight">{{ t('app.title') }}</span>
        </a>
        <div class="flex items-center gap-3">
          <button
            @click="toggleLanguage"
            class="h-9 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
            title="Toggle Language"
          >
            {{ locale === 'zh' ? 'EN' : '中' }}
          </button>
        </div>
      </div>
    </header>

    <section class="relative pt-14 sm:pt-24 pb-16">
      <div class="max-w-6xl mx-auto px-5 sm:px-8">
        <div class="flex flex-col items-center text-center">
          <h1 class="text-[44px] leading-[1.1] sm:text-[64px] font-extrabold tracking-tight text-slate-950 max-w-4xl">
            {{ t('hero.title') }}
          </h1>
          
          <p class="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
            {{ t('hero.subtitle') }}
          </p>
          
          <div class="mt-10 flex flex-wrap justify-center gap-4 relative">
            <a
              href="#generator"
              class="h-14 px-8 rounded-full bg-[#536350] text-[#ecfee5] hover:bg-[#475744] transition-colors text-[15px] font-semibold inline-flex items-center gap-2 shadow-[0_12px_40px_rgba(45,52,48,0.06)]"
            >
              <Upload :size="18" />
              <span>{{ t('hero.ctaPrimary') }}</span>
            </a>
            <a
              href="#templates"
              class="h-14 px-8 rounded-full border border-[#acb4ae]/30 bg-[#fdfbf7] hover:bg-[#e4e2de] transition-colors text-[15px] font-semibold text-[#536350] inline-flex items-center gap-2"
            >
              <Palette :size="18" />
              <span>{{ t('hero.ctaSecondary') }}</span>
            </a>
          </div>
          <p class="mt-5 text-xs text-slate-500">
            {{ t('hero.note') }}
          </p>
        </div>
      </div>
    </section>

    <section id="generator" class="relative py-8 lg:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="lg:grid lg:grid-cols-[380px_1fr] lg:gap-6">
          <!-- Left Panel -->
          <div class="rounded-2xl border border-[#e4e2de] bg-white shadow-[0_8px_30px_rgba(45,52,48,0.04)] p-5 mb-6 lg:mb-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:overflow-hidden">
            <ControlPanel />
            <ExportSection />
          </div>

          <!-- Right Canvas -->
          <div class="rounded-2xl bg-[#f0efed] p-4 sm:p-6 min-h-[600px]" id="templates">
            <PreviewGrid />
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-slate-200 bg-white">
      <div class="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="LogoWear" class="w-9 h-9 rounded-xl shadow-sm object-cover" />
          <div>
            <div class="text-sm font-semibold text-slate-900">{{ t('footer.title') }}</div>
            <div class="text-xs text-slate-500">{{ t('footer.subtitle') }}</div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <a v-if="links.x" :href="links.x" target="_blank" rel="noreferrer" class="h-9 px-4 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
            {{ t('footer.x') }}
          </a>
          <a v-if="links.github" :href="links.github" target="_blank" rel="noreferrer" class="h-9 px-4 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
            {{ t('footer.github') }}
          </a>
          <a v-if="links.blog" :href="links.blog" target="_blank" rel="noreferrer" class="h-9 px-4 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
            {{ t('footer.blog') }}
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
