<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'
import { Grid2x2, Search, Folder, Wifi } from 'lucide-vue-next'
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
      size: 128,
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
    class="h-32 sm:h-36 rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(45,52,48,0.06)] border border-[#e4e2de] transition-colors relative flex flex-col justify-end bg-[url('/bg/windows.png')] bg-cover bg-center">

    <!-- Windows 11 Taskbar -->
    <div
      class="h-12 w-full bg-[#f3f3f3]/80 backdrop-blur-2xl relative z-10 flex items-center gap-2 border-t border-white/60 px-2.5 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">

      <div class="flex items-center gap-0.5">
        <div
          class="w-9 h-9 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer text-slate-700">
          <Grid2x2 :size="20" color="#0078d4" />
        </div>

        <div
          class="w-9 h-9 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer text-slate-700">
          <Search :size="18" />
        </div>

        <div
          class="w-9 h-9 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer relative group">
          <div
            class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-800 font-medium text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md border border-slate-200">
            App
          </div>
          <img v-if="generatedIcon" :src="generatedIcon" class="w-5 h-5 drop-shadow-sm" alt="App Icon" />
          <div v-else class="w-5 h-5 bg-slate-300 rounded-sm animate-pulse"></div>
          <div class="absolute bottom-0 w-1.5 h-0.5 bg-slate-400 rounded-full"></div>
        </div>

        <div
          class="w-9 h-9 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer text-slate-700">
          <Folder :size="18" />
        </div>
      </div>

      <div class="ml-auto flex items-center gap-1 text-xs text-slate-800 shrink-0">
        <div
          class="px-1.5 h-9 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer gap-1.5">
          <img v-if="generatedIcon" :src="generatedIcon" class="w-3.5 h-3.5 opacity-90" alt="Tray Icon" />
          <div v-else class="w-3.5 h-3.5 bg-slate-300 rounded-sm opacity-90"></div>
          <Wifi :size="13" />
        </div>
        <div
          class="px-1.5 h-9 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer text-[10px] leading-none font-medium">
          <span>10:00</span>
        </div>
      </div>
    </div>
  </div>
</template>
