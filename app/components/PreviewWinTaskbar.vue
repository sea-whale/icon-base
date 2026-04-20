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
  <div class="h-48 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 transition-colors relative flex flex-col justify-end bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20Windows%2011%20wallpaper%2C%20abstract%20blue%20waves%2C%20soft%20glow%2C%20minimal%2C%20high%20detail&image_size=landscape_16_9')] bg-cover bg-center">
    <div class="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
    
    <!-- Windows 11 Taskbar -->
    <div class="h-12 bg-white/70 dark:bg-[#1a1a1c]/80 backdrop-blur-xl border-t border-white/20 w-full flex items-center justify-center relative z-10 px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
      
      <!-- Start Button (Placeholder) -->
      <div class="w-10 h-10 rounded hover:bg-white/30 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer mr-1">
        <Grid2x2 :size="22" color="#0078d4" />
      </div>
      
      <!-- Search Button -->
      <div class="w-10 h-10 rounded hover:bg-white/30 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer mx-1 text-gray-700 dark:text-gray-300">
        <Search :size="20" />
      </div>

      <!-- Generated App Icon -->
      <div class="w-10 h-10 rounded bg-white/40 dark:bg-white/10 flex items-center justify-center transition-colors cursor-pointer mx-1 relative group">
        <div class="w-6 h-1 rounded-full bg-blue-500 absolute bottom-0"></div>
        <img v-if="generatedIcon" :src="generatedIcon" class="w-6 h-6 shadow-sm rounded-sm" alt="Win App Icon" />
        <div v-else class="w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-sm"></div>
      </div>
      
      <!-- Other App (Placeholder) -->
      <div class="w-10 h-10 rounded hover:bg-white/30 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer mx-1 text-gray-700 dark:text-gray-300">
        <Folder :size="20" />
      </div>
      
      <!-- Right Side Tray (Time, Battery, Wi-Fi) -->
      <div class="absolute right-2 flex items-center h-full gap-1 text-xs text-gray-800 dark:text-gray-200">
        <div class="px-2 h-10 rounded hover:bg-white/30 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer gap-2">
          <!-- Tray Icon Preview -->
          <img v-if="generatedIcon" :src="generatedIcon" class="w-4 h-4 opacity-90" alt="Tray Icon" />
          <div v-else class="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded-sm opacity-90"></div>
          
          <Wifi :size="14" />
        </div>
        <div class="px-2 h-10 rounded hover:bg-white/30 dark:hover:bg-white/10 flex flex-col items-center justify-center transition-colors cursor-pointer leading-tight">
          <span>10:00 AM</span>
          <span>10/24/2023</span>
        </div>
      </div>
    </div>
  </div>
</template>
