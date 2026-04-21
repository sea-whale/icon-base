<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'
import { Grid2x2, Search, Folder, Wifi } from 'lucide-vue-next'

const uploadedImage = inject<Ref<string | null>>('uploadedImage', ref(null))
const backgroundId = inject<Ref<string>>('backgroundId', ref('apple-dark'))
const padding = inject<Ref<number>>('padding', ref(20))
const borderRadius = inject<Ref<number>>('borderRadius', ref(22.5))

const generatedIcon = ref<string>('')

const updateIcon = async () => {
  if (!uploadedImage?.value || !backgroundId || !padding || !borderRadius) return

  try {
    const { generateIconDataUrl } = await import('../utils/iconGenerator')
    generatedIcon.value = await generateIconDataUrl({
      imageUrl: uploadedImage.value,
      backgroundId: backgroundId.value,
      padding: padding.value,
      borderRadius: borderRadius.value,
      size: 128,
      transparentBg: false
    })
  } catch (e) {
    console.error(e)
  }
}

watch([uploadedImage, backgroundId, padding, borderRadius], updateIcon, { immediate: true })
</script>

<template>
  <div
    class="h-36 rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(45,52,48,0.06)] border border-[#e4e2de] transition-colors relative flex flex-col justify-end bg-[url('/bg/windows.png')] bg-cover bg-center">

    <!-- Windows 11 Taskbar -->
    <div
      class="h-12 w-full bg-[#f3f3f3]/80 backdrop-blur-2xl relative z-10 flex items-center justify-center border-t border-white/60 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">

      <!-- Start Button (Placeholder) -->
      <div
        class="w-10 h-10 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer mr-1">
        <Grid2x2 :size="22" color="#0078d4" />
      </div>

      <!-- Search Button -->
      <div
        class="w-10 h-10 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer mx-1 text-slate-700">
        <Search :size="20" />
      </div>

      <!-- Generated Icon App -->
      <div
        class="w-10 h-10 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer mx-1 relative group">
        <div
          class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-800 font-medium text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md border border-slate-200">
          App
        </div>
        <img v-if="generatedIcon" :src="generatedIcon" class="w-6 h-6 drop-shadow-sm" alt="App Icon" />
        <div v-else class="w-6 h-6 bg-slate-300 rounded-sm animate-pulse"></div>
        <div class="absolute bottom-0 w-1.5 h-0.5 bg-slate-400 rounded-full"></div>
      </div>

      <!-- Other App (Placeholder) -->
      <div
        class="w-10 h-10 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer mx-1 text-slate-700">
        <Folder :size="20" />
      </div>

      <!-- Right Side Tray (Time, Battery, Wi-Fi) -->
      <div class="absolute right-2 flex items-center h-full gap-1 text-xs text-slate-800">
        <div
          class="px-2 h-10 rounded hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer gap-2">
          <!-- Tray Icon Preview -->
          <img v-if="generatedIcon" :src="generatedIcon" class="w-4 h-4 opacity-90" alt="Tray Icon" />
          <div v-else class="w-4 h-4 bg-slate-300 rounded-sm opacity-90"></div>

          <Wifi :size="14" />
        </div>
        <div
          class="px-2 h-10 rounded hover:bg-white/40 flex flex-col items-end justify-center transition-colors cursor-pointer text-[10px] leading-tight text-right font-medium">
          <span>10:00 AM</span>
          <span>10/24/2023</span>
        </div>
      </div>
    </div>
  </div>
</template>
