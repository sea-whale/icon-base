<script setup lang="ts">
import { inject, ref, onMounted, computed, watch, type Ref, type ComputedRef } from 'vue'
import { BACKGROUNDS } from '../utils/backgrounds'
import { generateIconDataUrl, type IconShapeMode } from '../utils/iconGenerator'
import { Upload, Shuffle, Info, RotateCcw } from 'lucide-vue-next'
import { useI18n } from '#imports'
import appleIconShapeUrl from '../assets/svgs/Apple-Icon-Shape.svg'

const { t, te, locale } = useI18n()

const uploadedImage = inject<Ref<string | null>>('uploadedImage', ref(null))
const backgroundId = inject<Ref<string>>('backgroundId', ref('apple-dark'))
const padding = inject<Ref<number>>('padding', ref(20))
const borderRadius = inject<Ref<number>>('borderRadius', ref(22.5))
const imageBorderRadius = inject<Ref<number>>('imageBorderRadius', ref(0))
const imageOffsetX = inject<Ref<number>>('imageOffsetX', ref(0))
const imageOffsetY = inject<Ref<number>>('imageOffsetY', ref(0))
const shapeMode = inject<Ref<IconShapeMode>>('shapeMode', ref('rounded-rect'))
const isDefaultImage = inject<ComputedRef<boolean>>('isDefaultImage', computed(() => true))
const resetGeneratorSettings = inject<() => void>('resetGeneratorSettings', () => {})

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const backgroundPreviews = ref<Record<string, string>>({})

const shapeCopy = computed(() => {
  if (locale.value.startsWith('zh')) {
    return {
      title: '图标形状',
      standard: '标准圆角',
      official: 'Apple 官方方案',
      officialHint: '使用固定的 Apple 官方图标轮廓，圆角滑块将不再生效。'
    }
  }

  return {
    title: 'Icon Shape',
    standard: 'Standard Rounded',
    official: 'Apple Official',
    officialHint: 'Uses the fixed Apple icon contour. The border radius slider is disabled in this mode.'
  }
})

const getPreviewKey = (id: string) => `${shapeMode.value}:${id}`

const generatePreviews = async () => {
  // We generate blank icons without foreground images to show just the background
  // For previews, we use a 1x1 transparent image to trick the generator into just drawing the background
  const transparent1x1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

  // We don't want to block the UI, so we generate them in the background
  for (const bg of BACKGROUNDS) {
    const key = getPreviewKey(bg.id)
    if (!backgroundPreviews.value[key]) {
      try {
        const url = await generateIconDataUrl({
          imageUrl: transparent1x1,
          backgroundId: bg.id,
          padding: 0,
          borderRadius: 22.5,
          shapeMode: shapeMode.value,
          size: 64, // small size for thumbnails
          transparentBg: false
        })
        backgroundPreviews.value = { ...backgroundPreviews.value, [key]: url }
      } catch (e) {
        console.error('Failed to generate preview for', bg.id, e)
      }
    }
  }
}

const getBackgroundLabel = (id: string, fallback: string) => {
  return te(`backgrounds.${id}`) ? t(`backgrounds.${id}`) : fallback
}

const groupedBackgrounds = computed(() => {
  const map: Record<string, typeof BACKGROUNDS> = {
    [t('panel.categories.solid')]: [],
    [t('panel.categories.gradient')]: [],
    [t('panel.categories.mesh')]: [],
    [t('panel.categories.glass')]: [],
    [t('panel.categories.pattern')]: [],
    [t('panel.categories.glow')]: []
  }

  BACKGROUNDS.forEach(bg => {
    if (bg.type === 'solid') map[t('panel.categories.solid')].push(bg)
    else if (bg.type === 'linear') map[t('panel.categories.gradient')].push(bg)
    else if (bg.type === 'mesh' || bg.type === 'grid') map[t('panel.categories.mesh')].push(bg)
    else if (bg.type === 'glass') map[t('panel.categories.glass')].push(bg)
    else if (bg.type === 'noise' || bg.type === 'confetti' || bg.type === 'dots' || bg.type === 'stripes' || bg.type === 'checkerboard') map[t('panel.categories.pattern')].push(bg)
    else if (bg.type === 'radial' || bg.type === 'spotlight' || bg.type === 'accent') map[t('panel.categories.glow')].push(bg)
  })

  // Filter out empty groups
  return Object.entries(map).filter(([_, list]) => list.length > 0)
})

onMounted(() => {
  generatePreviews()
})

watch(shapeMode, () => {
  generatePreviews()
})
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) processFile(file)
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file.')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    if (uploadedImage) {
      uploadedImage.value = e.target?.result as string
      // Randomly select a background template on upload
      const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
      if (backgroundId) {
        backgroundId.value = randomBg.id
      }
    }
  }
  reader.readAsDataURL(file)
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const randomizeBackground = () => {
  const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
  if (backgroundId) {
    backgroundId.value = randomBg.id
  }
}

const formatOffset = (value: number) => (value > 0 ? `+${value}` : `${value}`) + '%'
</script>

<template>
  <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
    <div class="flex flex-col min-h-0">
      <div
        class="shrink-0 border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden"
        :class="[
          isDragging
            ? 'border-[#536350] bg-[#536350]/5'
            : 'border-[#e4e2de] hover:border-[#acb4ae]',
          uploadedImage ? 'h-24' : 'h-32'
        ]" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
        @click="triggerUpload">
        <input type="file" ref="fileInput" class="hidden" accept="image/png, image/jpeg, image/svg+xml, image/webp"
          @change="handleFileUpload" />

        <template v-if="!uploadedImage">
          <div
            class="w-9 h-9 bg-[#fdfbf7] border border-[#e4e2de] rounded-xl flex items-center justify-center mb-2.5 shadow-sm">
            <Upload :size="18" class="text-[#536350]" />
          </div>
          <p class="text-sm font-bold text-[#2d3430]">{{ t('panel.uploadOrDrag') }}</p>
          <p class="text-[11px] text-[#757c77] mt-1">{{ t('panel.supportedFormats') }}</p>
        </template>
        <template v-else>
          <div class="absolute inset-0 w-full h-full opacity-30"
            :style="{ backgroundImage: `url(${uploadedImage})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(12px)' }">
          </div>
          <div class="relative z-10 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xl shadow-lg border border-white/40 p-1.5">
              <img :src="uploadedImage" class="w-full h-full object-contain" />
            </div>
            <p
              class="text-xs font-bold text-[#2d3430] bg-white/60 px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm border border-white/40">
              {{
                t('panel.changeImage') }}</p>
          </div>
        </template>
      </div>

      <div v-if="isDefaultImage"
        class="shrink-0 flex items-center gap-2 mt-4 px-3 py-2 bg-[#536350]/5 border border-[#536350]/10 rounded-lg">
        <Info :size="14" class="text-[#536350] shrink-0" />
        <p class="text-[11px] text-[#536350] leading-snug">{{ t('panel.demoHint') }}</p>
      </div>

      <div class="shrink-0 mt-4 flex items-center justify-between rounded-xl border border-[#e4e2de] bg-[#f8f7f4] px-3 py-2.5">
        <div>
          <p class="text-xs font-semibold text-[#2d3430]">{{ t('panel.adjustmentsTitle') }}</p>
          <p class="text-[11px] text-[#757c77]">{{ t('panel.adjustmentsHint') }}</p>
        </div>
        <button
          type="button"
          @click="resetGeneratorSettings"
          class="inline-flex items-center gap-1.5 rounded-lg border border-[#d8d4cf] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#536350] transition-colors hover:border-[#536350]/40 hover:bg-[#536350]/5"
        >
          <RotateCcw :size="12" />
          <span>{{ t('panel.resetParams') }}</span>
        </button>
      </div>

      <div class="shrink-0 mt-4">
        <div class="flex justify-between items-center">
          <label class="text-xs font-semibold text-[#2d3430]">{{ shapeCopy.title }}</label>
          <span class="text-[10px] font-mono text-[#536350] bg-[#536350]/5 px-1.5 py-0.5 rounded-md">
            {{ shapeMode === 'apple-official' ? shapeCopy.official : shapeCopy.standard }}
          </span>
        </div>

        <div class="mt-2 grid grid-cols-2 gap-2">
          <button type="button" @click="shapeMode = 'rounded-rect'"
            class="rounded-xl border p-2.5 text-left transition-all"
            :class="shapeMode === 'rounded-rect' ? 'border-[#536350] bg-[#536350]/5 ring-1 ring-[#536350]/20' : 'border-[#e4e2de] bg-white hover:border-[#acb4ae]'">
            <div class="h-16 rounded-[18px] bg-[linear-gradient(135deg,#d9f99d,#5eead4)] shadow-sm"></div>
            <div class="mt-2 text-xs font-semibold text-[#2d3430]">{{ shapeCopy.standard }}</div>
          </button>

          <button type="button" @click="shapeMode = 'apple-official'"
            class="rounded-xl border p-2.5 text-left transition-all"
            :class="shapeMode === 'apple-official' ? 'border-[#536350] bg-[#536350]/5 ring-1 ring-[#536350]/20' : 'border-[#e4e2de] bg-white hover:border-[#acb4ae]'">
            <div
              class="h-16 rounded-[18px] bg-[linear-gradient(135deg,#111827,#334155)] shadow-sm flex items-center justify-center">
              <img :src="appleIconShapeUrl" alt="" class="w-12 h-12 opacity-95" />
            </div>
            <div class="mt-2 text-xs font-semibold text-[#2d3430]">{{ shapeCopy.official }}</div>
          </button>
        </div>

        <p v-if="shapeMode === 'apple-official'" class="mt-2 text-[11px] leading-snug text-[#536350]">
          {{ shapeCopy.officialHint }}
        </p>
      </div>

      <div class="shrink-0 space-y-3 pt-3 mt-4 border-t border-[#e4e2de]/50">
        <div class="space-y-1.5">
          <div class="flex justify-between items-center">
            <label class="text-xs font-semibold text-[#2d3430]">{{ t('panel.padding') }}</label>
            <span class="text-[10px] font-mono text-[#536350] bg-[#536350]/10 px-1.5 py-0.5 rounded-md">{{ padding
            }}%</span>
          </div>
          <div class="relative">
            <div class="w-full h-1.5 bg-[#e4e2de] rounded-full relative overflow-hidden pointer-events-none">
              <div class="absolute top-0 left-0 h-full bg-[#536350] rounded-full transition-all"
                :style="{ width: `${padding * 2}%` }"></div>
            </div>
            <input type="range" v-model.number="padding" min="0" max="50"
              class="absolute top-0 left-0 w-full h-4 -translate-y-1 opacity-0 cursor-pointer" />
          </div>
        </div>

        <div class="space-y-1.5" :class="shapeMode === 'apple-official' ? 'opacity-50' : ''">
          <div class="flex justify-between items-center">
            <label class="text-xs font-semibold text-[#2d3430]">{{ t('panel.borderRadius') }}</label>
            <span class="text-[10px] font-mono text-[#536350] bg-[#536350]/10 px-1.5 py-0.5 rounded-md">{{ borderRadius
            }}%</span>
          </div>
          <div class="relative">
            <div class="w-full h-1.5 bg-[#e4e2de] rounded-full relative overflow-hidden pointer-events-none">
              <div class="absolute top-0 left-0 h-full bg-[#536350] rounded-full transition-all"
                :style="{ width: `${borderRadius * 2}%` }"></div>
            </div>
            <input type="range" v-model.number="borderRadius" min="0" max="50"
              :disabled="shapeMode === 'apple-official'"
              class="absolute top-0 left-0 w-full h-4 -translate-y-1 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
          </div>
        </div>

        <div class="space-y-1.5 pt-1">
          <div class="flex justify-between items-center">
            <label class="text-xs font-semibold text-[#2d3430]">{{ t('panel.imageBorderRadius') }}</label>
            <span class="text-[10px] font-mono text-[#536350] bg-[#536350]/10 px-1.5 py-0.5 rounded-md">{{ imageBorderRadius }}%</span>
          </div>
          <div class="relative">
            <div class="w-full h-1.5 bg-[#e4e2de] rounded-full relative overflow-hidden pointer-events-none">
              <div class="absolute top-0 left-0 h-full bg-[#536350] rounded-full transition-all"
                :style="{ width: `${imageBorderRadius * 2}%` }"></div>
            </div>
            <input type="range" v-model.number="imageBorderRadius" min="0" max="50"
              class="absolute top-0 left-0 w-full h-4 -translate-y-1 opacity-0 cursor-pointer" />
          </div>
        </div>

        <div class="rounded-xl border border-[#e4e2de] bg-[#faf9f6] px-3 py-3">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-[#2d3430]">{{ t('panel.imagePosition') }}</label>
            <span class="text-[10px] font-mono text-[#536350] bg-[#536350]/10 px-1.5 py-0.5 rounded-md">{{ t('panel.centerOrigin') }}</span>
          </div>
          <p class="mt-1 text-[11px] leading-snug text-[#757c77]">{{ t('panel.positionHint') }}</p>

          <div class="mt-3 space-y-3">
            <div class="space-y-1.5">
              <div class="flex justify-between items-center">
                <label class="text-[11px] font-semibold text-[#2d3430]">{{ t('panel.imageOffsetX') }}</label>
                <span class="text-[10px] font-mono text-[#536350] bg-white px-1.5 py-0.5 rounded-md border border-[#e4e2de]">{{ formatOffset(imageOffsetX) }}</span>
              </div>
              <div class="relative">
                <div class="w-full h-1.5 rounded-full bg-[#e4e2de] relative overflow-hidden pointer-events-none">
                  <div class="absolute inset-y-0 left-1/2 w-px bg-[#536350]/35"></div>
                  <div
                    class="absolute top-0 h-full bg-[#536350] rounded-full transition-all"
                    :style="imageOffsetX >= 0
                      ? { left: '50%', width: `${imageOffsetX}%` }
                      : { left: `${50 + imageOffsetX}%`, width: `${Math.abs(imageOffsetX)}%` }"
                  ></div>
                </div>
                <input type="range" v-model.number="imageOffsetX" min="-50" max="50"
                  class="absolute top-0 left-0 w-full h-4 -translate-y-1 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between items-center">
                <label class="text-[11px] font-semibold text-[#2d3430]">{{ t('panel.imageOffsetY') }}</label>
                <span class="text-[10px] font-mono text-[#536350] bg-white px-1.5 py-0.5 rounded-md border border-[#e4e2de]">{{ formatOffset(imageOffsetY) }}</span>
              </div>
              <div class="relative">
                <div class="w-full h-1.5 rounded-full bg-[#e4e2de] relative overflow-hidden pointer-events-none">
                  <div class="absolute inset-y-0 left-1/2 w-px bg-[#536350]/35"></div>
                  <div
                    class="absolute top-0 h-full bg-[#536350] rounded-full transition-all"
                    :style="imageOffsetY >= 0
                      ? { left: '50%', width: `${imageOffsetY}%` }
                      : { left: `${50 + imageOffsetY}%`, width: `${Math.abs(imageOffsetY)}%` }"
                  ></div>
                </div>
                <input type="range" v-model.number="imageOffsetY" min="-50" max="50"
                  class="absolute top-0 left-0 w-full h-4 -translate-y-1 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col min-h-0 lg:border-l lg:border-[#e4e2de]/70 lg:pl-6">
      <div class="shrink-0 flex justify-between items-center">
        <label class="text-xs font-semibold text-[#2d3430]">{{ t('panel.bgTemplate') }}</label>
        <div class="flex items-center gap-1.5">
          <span
            class="text-[10px] font-mono text-[#536350] bg-[#536350]/5 px-1.5 py-0.5 rounded-md truncate max-w-[120px]">{{
              getBackgroundLabel(BACKGROUNDS.find(b => b.id === backgroundId)?.id || '', BACKGROUNDS.find(b => b.id ===
                backgroundId)?.name || '')}}</span>
          <button @click="randomizeBackground"
            class="p-1 hover:bg-[#536350]/5 rounded-md transition-colors text-[#757c77] hover:text-[#536350]"
            :title="t('panel.shuffle')">
            <Shuffle :size="14" />
          </button>
        </div>
      </div>

      <div class="mt-2.5 flex-1 min-h-0 max-h-[26rem] overflow-y-auto pr-1">
        <div v-for="[groupName, bgList] in groupedBackgrounds" :key="groupName" class="mb-2.5">
          <p class="text-[10px] text-[#757c77] font-semibold uppercase tracking-wider mb-1.5">{{ groupName }}</p>
          <div class="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-6 gap-1.5 px-2">
            <button v-for="bg in bgList" :key="bg.id" @click="backgroundId = bg.id"
              :title="getBackgroundLabel(bg.id, bg.name)"
              class="w-full aspect-square rounded-lg border border-[#acb4ae]/30 transition-all overflow-hidden bg-[#fdfbf7] relative group"
              :class="backgroundId === bg.id ? 'ring-2 ring-[#536350] ring-offset-1 scale-110 shadow-[0_2px_8px_rgba(45,52,48,0.12)] z-10' : 'hover:scale-105 hover:shadow-[0_2px_8px_rgba(45,52,48,0.06)]'">
              <img v-if="backgroundPreviews[getPreviewKey(bg.id)]" :src="backgroundPreviews[getPreviewKey(bg.id)]"
                class="w-full h-full object-cover" />
              <div v-else class="w-full h-full animate-pulse bg-[#e4e2de]"></div>
            </button>
          </div>
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>
