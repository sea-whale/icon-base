<script setup lang="ts">
import { inject, ref, onMounted, computed, type Ref } from 'vue'
import { BACKGROUNDS, type BgType } from '../utils/backgrounds'
import { generateIconDataUrl } from '../utils/iconGenerator'
import { Upload, Shuffle, Download, Loader2, Info } from 'lucide-vue-next'
import { useI18n } from '#imports'

const { t } = useI18n()

const uploadedImage = inject<Ref<string | null>>('uploadedImage', ref(null))
const backgroundId = inject<Ref<string>>('backgroundId', ref('apple-dark'))
const padding = inject<Ref<number>>('padding', ref(20))
const borderRadius = inject<Ref<number>>('borderRadius', ref(22.5))

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isExporting = ref(false)

const backgroundPreviews = ref<Record<string, string>>({})

const generatePreviews = async () => {
  // We generate blank icons without foreground images to show just the background
  // For previews, we use a 1x1 transparent image to trick the generator into just drawing the background
  const transparent1x1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

  // We don't want to block the UI, so we generate them in the background
  for (const bg of BACKGROUNDS) {
    if (!backgroundPreviews.value[bg.id]) {
      try {
        const url = await generateIconDataUrl({
          imageUrl: transparent1x1,
          backgroundId: bg.id,
          padding: 0,
          borderRadius: 22.5,
          size: 64, // small size for thumbnails
          transparentBg: false
        })
        backgroundPreviews.value = { ...backgroundPreviews.value, [bg.id]: url }
      } catch (e) {
        console.error('Failed to generate preview for', bg.id, e)
      }
    }
  }
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
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Upload Area -->
    <div
      class="border-[3px] border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden"
      :class="[
        isDragging
          ? 'border-[#536350] bg-[#536350]/5'
          : 'border-[#e4e2de] hover:border-[#acb4ae]',
        uploadedImage ? 'h-36' : 'h-56'
      ]" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
      @click="triggerUpload">
      <input type="file" ref="fileInput" class="hidden" accept="image/png, image/jpeg, image/svg+xml, image/webp"
        @change="handleFileUpload" />

      <template v-if="!uploadedImage">
        <div class="w-14 h-14 bg-[#fdfbf7] border border-[#e4e2de] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <Upload :size="24" class="text-[#536350]" />
        </div>
        <p class="text-base font-bold text-[#2d3430]">{{ t('panel.uploadOrDrag') }}</p>
        <p class="text-sm text-[#757c77] mt-1.5">{{ t('panel.supportedFormats') }}</p>
      </template>
      <template v-else>
        <div class="absolute inset-0 w-full h-full opacity-30"
          :style="{ backgroundImage: `url(${uploadedImage})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(12px)' }">
        </div>
        <div class="relative z-10 flex flex-col items-center">
          <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl shadow-lg border border-white/40 p-2.5 mb-3">
            <img :src="uploadedImage" class="w-full h-full object-contain" />
          </div>
          <p class="text-xs font-bold text-[#2d3430] bg-white/60 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-sm border border-white/40">{{
            t('panel.changeImage') }}</p>
        </div>
      </template>
    </div>

    <template v-if="uploadedImage">
      <!-- Background Style Categories -->
      <div class="space-y-6 pt-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-[#536350]/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-[#536350] text-sm" style="font-variation-settings: 'FILL' 1;">palette</span>
            </div>
            <label class="text-base font-bold text-[#2d3430]">{{ t('panel.bgTemplate') }}</label>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-[#536350] bg-[#536350]/5 px-2 py-1 rounded-md">{{t('backgrounds.' + BACKGROUNDS.find(b => b.id ===
              backgroundId)?.id) || BACKGROUNDS.find(b => b.id === backgroundId)?.name }}</span>
            <button @click="randomizeBackground"
              class="p-1.5 hover:bg-[#536350]/5 rounded-lg transition-colors text-[#757c77] hover:text-[#536350]"
              :title="t('panel.shuffle')">
              <Shuffle :size="16" />
            </button>
          </div>
        </div>

        <div v-for="[groupName, bgList] in groupedBackgrounds" :key="groupName" class="space-y-3">
          <p class="text-xs text-[#757c77] font-semibold uppercase tracking-wider">{{ groupName }}</p>
          <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2.5">
            <button v-for="bg in bgList" :key="bg.id" @click="backgroundId = bg.id"
              :title="t('backgrounds.' + bg.id) || bg.name"
              class="w-12 h-12 rounded-2xl border border-[#acb4ae]/30 transition-all overflow-hidden bg-[#fdfbf7] relative group"
              :class="backgroundId === bg.id ? 'ring-2 ring-[#536350] ring-offset-2 scale-110 shadow-[0_4px_12px_rgba(45,52,48,0.12)] z-10' : 'hover:scale-105 hover:shadow-[0_4px_12px_rgba(45,52,48,0.06)]'">
              <img v-if="backgroundPreviews[bg.id]" :src="backgroundPreviews[bg.id]"
                class="w-full h-full object-cover" />
              <div v-else class="w-full h-full animate-pulse bg-[#e4e2de]"></div>
              
              <div v-if="backgroundId === bg.id" class="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Settings Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-[#e4e2de]/50 mb-4">
        <!-- Padding -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="text-sm font-semibold text-[#2d3430]">{{ t('panel.padding') }}</label>
            <span class="text-xs font-mono text-[#536350] bg-[#536350]/10 px-2 py-1 rounded-md">{{ padding }}%</span>
          </div>
          <div class="relative pt-2">
            <div class="w-full h-2 bg-[#e4e2de] rounded-full relative overflow-hidden pointer-events-none">
              <div class="absolute top-0 left-0 h-full bg-[#536350] rounded-full transition-all" :style="{ width: `${padding * 2}%` }"></div>
            </div>
            <input type="range" v-model.number="padding" min="0" max="50" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        </div>

        <!-- Border Radius -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="text-sm font-semibold text-[#2d3430]">{{ t('panel.borderRadius') }}</label>
            <span class="text-xs font-mono text-[#536350] bg-[#536350]/10 px-2 py-1 rounded-md">{{ borderRadius }}%</span>
          </div>
          <div class="relative pt-2">
            <div class="w-full h-2 bg-[#e4e2de] rounded-full relative overflow-hidden pointer-events-none">
              <div class="absolute top-0 left-0 h-full bg-[#536350] rounded-full transition-all" :style="{ width: `${borderRadius * 2}%` }"></div>
            </div>
            <input type="range" v-model.number="borderRadius" min="0" max="50" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
