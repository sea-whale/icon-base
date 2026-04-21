<script setup lang="ts">
import { useAppConfig, useHead, useI18n } from '#imports'
import { computed, ref, provide, onMounted } from 'vue'
import { ArrowRight, Github } from 'lucide-vue-next'
import ControlPanel from './components/ControlPanel.vue'
import PreviewGrid from './components/PreviewGrid.vue'
import ExportSection from './components/ExportSection.vue'

const { t, locale, setLocale } = useI18n()
const appConfig = useAppConfig()

useHead({
  title: 'IconBase - Icon Generator',
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

// Hero preview: generate a sample icon for the from/to showcase
const heroIcon64 = ref<string>('')
const heroIcon32 = ref<string>('')
const heroIcon180 = ref<string>('')

const generateHeroPreviews = async () => {
  try {
    const { generateIconDataUrl } = await import('./utils/iconGenerator')
    heroIcon64.value = await generateIconDataUrl({
      imageUrl: '/logo.svg',
      backgroundId: 'glass-green-glow',
      padding: 20,
      borderRadius: 22.5,
      size: 64,
      transparentBg: false
    })
    heroIcon32.value = await generateIconDataUrl({
      imageUrl: '/logo.svg',
      backgroundId: 'grad-lime',
      padding: 20,
      borderRadius: 22.5,
      size: 32,
      transparentBg: false
    })
    heroIcon180.value = await generateIconDataUrl({
      imageUrl: '/logo.svg',
      backgroundId: 'grad-sunset',
      padding: 20,
      borderRadius: 22.5,
      size: 180,
      transparentBg: false
    })
  } catch (e) {
    console.error('Failed to generate hero previews', e)
  }
}

onMounted(() => {
  generateHeroPreviews()
})

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
      <div class="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#" class="flex items-center gap-3">
          <img src="/logo.png" alt="IconBase" class="w-8 h-8 rounded-lg shadow-sm object-cover" />
          <span class="text-[15px] font-semibold tracking-tight">{{ t('app.title') }}</span>
        </a>
        <div class="flex items-center gap-2">
          <a v-if="links.github" :href="links.github" target="_blank" rel="noreferrer"
            class="h-9 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 text-slate-600">
            <Github :size="16" />
          </a>
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

    <section class="relative pt-14 sm:pt-20 pb-16">
      <div class="max-w-5xl mx-auto px-5 sm:px-8">
        <div class="flex flex-col items-center text-center">
          <h1 class="text-[40px] leading-[1.1] sm:text-[56px] font-extrabold tracking-tight text-slate-950 max-w-3xl">
            {{ t('hero.title') }}
          </h1>

          <!-- From -> To Showcase -->
          <div class="mt-12 flex items-center gap-6 sm:gap-10">
            <!-- From: Original Logo -->
            <div class="flex flex-col items-center gap-3">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-[#acb4ae] bg-white flex items-center justify-center p-3 shadow-sm">
                <img src="/logo.svg" alt="Logo" class="w-full h-full object-contain" />
              </div>
              <span class="text-xs font-semibold text-[#757c77]">{{ t('hero.fromLabel') }}</span>
            </div>

            <!-- Arrow -->
            <div class="flex flex-col items-center gap-1 text-[#536350]">
              <ArrowRight :size="28" class="hidden sm:block" />
              <ArrowRight :size="22" class="sm:hidden" />
            </div>

            <!-- To: Generated Icons Showcase -->
            <div class="flex flex-col items-center gap-3">
              <div class="flex items-center gap-3">
                <!-- Browser favicon -->
                <div class="flex flex-col items-center gap-1.5">
                  <div class="w-6 h-6 rounded-sm overflow-hidden shadow-md">
                    <img v-if="heroIcon32" :src="heroIcon32" class="w-full h-full" alt="Favicon" />
                    <div v-else class="w-full h-full bg-[#e4e2de] animate-pulse"></div>
                  </div>
                  <span class="text-[9px] text-[#757c77]">Browser</span>
                </div>
                <!-- Desktop / Dock icon -->
                <div class="flex flex-col items-center gap-1.5">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-lg">
                    <img v-if="heroIcon64" :src="heroIcon64" class="w-full h-full" alt="Desktop" />
                    <div v-else class="w-full h-full bg-[#e4e2de] animate-pulse"></div>
                  </div>
                  <span class="text-[9px] text-[#757c77]">Desktop</span>
                </div>
                <!-- Mobile icon -->
                <div class="flex flex-col items-center gap-1.5">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] overflow-hidden shadow-lg">
                    <img v-if="heroIcon180" :src="heroIcon180" class="w-full h-full" alt="Mobile" />
                    <div v-else class="w-full h-full bg-[#e4e2de] animate-pulse"></div>
                  </div>
                  <span class="text-[9px] text-[#757c77]">Mobile</span>
                </div>
              </div>
              <span class="text-xs font-semibold text-[#757c77]">{{ t('hero.toLabel') }}</span>
            </div>
          </div>

          <!-- Single CTA Button -->
          <a
            href="#generator"
            class="mt-10 h-12 px-8 rounded-full bg-[#536350] text-[#ecfee5] hover:bg-[#475744] transition-colors text-[15px] font-semibold inline-flex items-center gap-2 shadow-[0_12px_40px_rgba(45,52,48,0.08)]"
          >
            <span>{{ t('hero.ctaPrimary') }}</span>
            <ArrowRight :size="18" />
          </a>
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
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between text-sm">
        <span class="text-slate-500">{{ t('footer.title') }} &middot; {{ t('footer.subtitle') }}</span>
        <div class="flex items-center gap-4">
          <a v-if="links.x" :href="links.x" target="_blank" rel="noreferrer" class="text-slate-500 hover:text-slate-700 transition-colors font-medium">
            {{ t('footer.x') }}
          </a>
          <a v-if="links.github" :href="links.github" target="_blank" rel="noreferrer" class="text-slate-500 hover:text-slate-700 transition-colors font-medium">
            {{ t('footer.github') }}
          </a>
          <a v-if="links.blog" :href="links.blog" target="_blank" rel="noreferrer" class="text-slate-500 hover:text-slate-700 transition-colors font-medium">
            {{ t('footer.blog') }}
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
