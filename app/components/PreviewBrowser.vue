<script setup lang="ts">
import { inject, watch, ref, type Ref } from 'vue'
import { Search, ChevronLeft, ChevronRight, RotateCw } from 'lucide-vue-next'
import type { IconShapeMode } from '../utils/iconGenerator'

const uploadedImage = inject<Ref<string | null>>('uploadedImage', ref(null))
const backgroundId = inject<Ref<string>>('backgroundId', ref('apple-dark'))
const padding = inject<Ref<number>>('padding', ref(20))
const borderRadius = inject<Ref<number>>('borderRadius', ref(22.5))
const shapeMode = inject<Ref<IconShapeMode>>('shapeMode', ref('rounded-rect'))

const generatedIcon = ref<string>('')

const updateIcon = async () => {
  if (!import.meta.client) return
  if (!uploadedImage?.value || !backgroundId || !padding || !borderRadius) return

  try {
    const { generateIconDataUrl } = await import('../utils/iconGenerator')
    generatedIcon.value = await generateIconDataUrl({
      imageUrl: uploadedImage.value,
      backgroundId: backgroundId.value,
      padding: padding.value,
      borderRadius: borderRadius.value,
      shapeMode: shapeMode.value,
      size: 64,
      transparentBg: false
    })
  } catch (e) {
    console.error(e)
  }
}

watch([uploadedImage, backgroundId, padding, borderRadius, shapeMode], updateIcon, { immediate: true })
</script>

<template>
  <div
    class="rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(45,52,48,0.06)] border border-[#e4e2de] transition-colors">
    <!-- Browser Top Bar -->
    <div class="h-12 bg-[#fdfbf7] flex items-center px-4 gap-2 select-none border-b border-[#e4e2de]">
      <!-- Traffic Lights -->
      <div class="flex gap-2">
        <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
        <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
        <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
      </div>

      <!-- Browser Tabs Container -->
      <div class="flex-1 flex px-4 mt-2 h-10 items-end overflow-hidden">
        <!-- Active Tab -->
        <div
          class="h-8 min-w-[160px] max-w-[200px] bg-white rounded-t-lg flex items-center px-3 gap-2 shadow-[0_-2px_6px_rgba(45,52,48,0.05)] border-x border-t border-[#e4e2de] relative z-20">
          <img v-if="generatedIcon" :src="generatedIcon" class="w-4 h-4 object-contain" alt="Favicon" />
          <div v-else class="w-4 h-4 bg-[#e4e2de] rounded-sm"></div>
          <span class="text-xs text-[#2d3430] font-bold truncate">IconBase</span>
        </div>

        <!-- Dark Tab -->
        <div
          class="h-8 min-w-[160px] max-w-[200px] bg-[#202124] rounded-t-lg flex items-center px-3 gap-2 shadow-[0_-2px_6px_rgba(0,0,0,0.15)] border-x border-t border-[#3c4043] relative z-10">
          <img v-if="generatedIcon" :src="generatedIcon" class="w-4 h-4 object-contain" alt="Favicon" />
          <div v-else class="w-4 h-4 bg-[#3c4043] rounded-sm"></div>
          <span class="text-xs text-[#e8eaed] font-bold truncate">IconBase (Dark)</span>
        </div>

        <!-- Inactive Tab -->
        <div
          class="h-8 min-w-[160px] max-w-[200px] flex items-center px-3 gap-2 opacity-50 hover:opacity-80 transition-opacity">
          <Search :size="16" class="text-[#757c77]" />
          <span class="text-xs text-[#757c77] font-semibold truncate">Google Search</span>
        </div>
      </div>
    </div>

    <!-- Browser Address Bar Area -->
    <div class="h-10 bg-white border-b border-[#e4e2de] flex items-center px-4 gap-4">
      <div class="flex gap-2 text-[#acb4ae]">
        <ChevronLeft :size="16" />
        <ChevronRight :size="16" />
        <RotateCw :size="16" />
      </div>
      <div class="flex-1 h-6 bg-[#fdfbf7] border border-[#e4e2de] rounded-md flex items-center px-3 justify-center">
        <span class="text-[11px] font-medium text-[#757c77]">iconbase.7-image.com</span>
      </div>
    </div>
  </div>
</template>
