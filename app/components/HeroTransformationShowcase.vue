<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from '#imports'
import { ArrowRight } from 'lucide-vue-next'
import { generateIconDataUrl } from '../utils/iconGenerator'

const props = defineProps<{
  backgroundId: string
}>()

const { locale } = useI18n()

const browserIcon = ref('')
const desktopIcon = ref('')
const mobileIcon = ref('')

const copy = computed(() => {
  const lang = locale.value.split('-')[0]

  if (lang === 'zh') {
    return {
      kicker: '上传一个 Logo，直接生成全平台图标',
      from: '原始 Logo',
      to: '生成后的图标',
      browser: '浏览器',
      desktop: '桌面',
      mobile: '手机',
      note: '实时预览 favicon、桌面图标和移动端图标效果'
    }
  }

  if (lang === 'ja') {
    return {
      kicker: '1つのロゴから各プラットフォーム向けアイコンを生成',
      from: '元のロゴ',
      to: '生成後のアイコン',
      browser: 'Browser',
      desktop: 'Desktop',
      mobile: 'Mobile',
      note: 'favicon、desktop、mobile icon をすぐに確認できます'
    }
  }

  if (lang === 'ko') {
    return {
      kicker: '하나의 로고에서 전 플랫폼 아이콘 생성',
      from: '원본 로고',
      to: '생성된 아이콘',
      browser: 'Browser',
      desktop: 'Desktop',
      mobile: 'Mobile',
      note: 'favicon, desktop, mobile icon 결과를 바로 확인할 수 있습니다'
    }
  }

  if (lang === 'de') {
    return {
      kicker: 'Ein Logo hochladen, Icons für alle Plattformen erzeugen',
      from: 'Originales Logo',
      to: 'Erzeugte Icons',
      browser: 'Browser',
      desktop: 'Desktop',
      mobile: 'Mobile',
      note: 'Favicon-, Desktop- und Mobile-Icons sofort im Vergleich sehen'
    }
  }

  if (lang === 'fr') {
    return {
      kicker: 'Un logo importé, des icônes pour toutes les plateformes',
      from: 'Logo source',
      to: 'Icônes générées',
      browser: 'Browser',
      desktop: 'Desktop',
      mobile: 'Mobile',
      note: 'Visualisez immédiatement le rendu favicon, desktop et mobile'
    }
  }

  if (lang === 'ru') {
    return {
      kicker: 'Один логотип на входе, иконки для всех платформ на выходе',
      from: 'Исходный логотип',
      to: 'Сгенерированные иконки',
      browser: 'Browser',
      desktop: 'Desktop',
      mobile: 'Mobile',
      note: 'Сразу видно, как логотип выглядит как favicon, desktop и mobile icon'
    }
  }

  return {
    kicker: 'Upload one logo, generate icons for every platform',
    from: 'Original logo',
    to: 'Generated icons',
    browser: 'Browser',
    desktop: 'Desktop',
    mobile: 'Mobile',
    note: 'Instantly preview favicon, desktop, and mobile icon output'
  }
})

onMounted(async () => {
  try {
    browserIcon.value = await generateIconDataUrl({
      imageUrl: '/logo.svg',
      backgroundId: 'grad-lime',
      padding: 20,
      borderRadius: 22.5,
      size: 32,
      transparentBg: false
    })

    desktopIcon.value = await generateIconDataUrl({
      imageUrl: '/logo.svg',
      backgroundId: props.backgroundId,
      padding: 20,
      borderRadius: 22.5,
      size: 64,
      transparentBg: false
    })

    mobileIcon.value = await generateIconDataUrl({
      imageUrl: '/logo.svg',
      backgroundId: 'grad-sunset',
      padding: 20,
      borderRadius: 22.5,
      size: 180,
      transparentBg: false
    })
  } catch (error) {
    console.error('Failed to render hero showcase icons', error)
  }
})
</script>

<template>
  <div class="mt-10 rounded-[28px] border border-slate-200/80 bg-white/85 backdrop-blur-xl px-5 py-6 sm:px-8 sm:py-8 shadow-[0_20px_60px_rgba(45,52,48,0.08)]">
    <p class="text-sm font-semibold tracking-[0.18em] uppercase text-[#536350]">
      {{ copy.kicker }}
    </p>
    <p class="mt-2 text-sm text-slate-500">
      {{ copy.note }}
    </p>

    <div class="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
      <div class="flex flex-col items-center gap-3 min-w-[112px]">
        <div class="w-24 h-24 rounded-[28px] border-2 border-dashed border-[#acb4ae] bg-white flex items-center justify-center p-4 shadow-sm">
          <img src="/logo.svg" alt="Original logo" class="w-full h-full object-contain" />
        </div>
        <span class="text-xs font-semibold text-[#757c77]">{{ copy.from }}</span>
      </div>

      <div class="flex items-center justify-center text-[#536350]">
        <ArrowRight :size="28" class="hidden sm:block" />
        <ArrowRight :size="22" class="sm:hidden rotate-90" />
      </div>

      <div class="flex flex-col items-center gap-3">
        <div class="flex items-end gap-3 sm:gap-4">
          <div class="flex flex-col items-center gap-1.5">
            <div class="w-8 h-8 rounded-md overflow-hidden shadow-md bg-[#f0efed] flex items-center justify-center">
              <img v-if="browserIcon" :src="browserIcon" class="w-full h-full" alt="Browser icon" />
              <div v-else class="w-full h-full bg-[#e4e2de] animate-pulse"></div>
            </div>
            <span class="text-[10px] font-medium text-[#757c77]">{{ copy.browser }}</span>
          </div>

          <div class="flex flex-col items-center gap-1.5">
            <div class="w-14 h-14 rounded-2xl overflow-hidden shadow-lg bg-[#f0efed] flex items-center justify-center">
              <img v-if="desktopIcon" :src="desktopIcon" class="w-full h-full" alt="Desktop icon" />
              <div v-else class="w-full h-full bg-[#e4e2de] animate-pulse"></div>
            </div>
            <span class="text-[10px] font-medium text-[#757c77]">{{ copy.desktop }}</span>
          </div>

          <div class="flex flex-col items-center gap-1.5">
            <div class="w-14 h-14 rounded-[18px] overflow-hidden shadow-lg bg-[#f0efed] flex items-center justify-center">
              <img v-if="mobileIcon" :src="mobileIcon" class="w-full h-full" alt="Mobile icon" />
              <div v-else class="w-full h-full bg-[#e4e2de] animate-pulse"></div>
            </div>
            <span class="text-[10px] font-medium text-[#757c77]">{{ copy.mobile }}</span>
          </div>
        </div>
        <span class="text-xs font-semibold text-[#757c77]">{{ copy.to }}</span>
      </div>
    </div>
  </div>
</template>
