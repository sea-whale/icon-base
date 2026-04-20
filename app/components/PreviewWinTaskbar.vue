<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'

const uploadedImage = inject<Ref<string | null>>('uploadedImage')
const backgroundId = inject<Ref<string>>('backgroundId')
const padding = inject<Ref<number>>('padding')
const borderRadius = inject<Ref<number>>('borderRadius')

const generatedIcon = ref<string>('')

const updateIcon = async () => {
  if (!uploadedImage?.value || !backgroundId || !padding || !borderRadius) return
  
  try {
    const { generateIconDataUrl } = await import('../utils/iconGenerator')
    // Windows typically uses less border-radius or even circles for taskbar, but we'll show the actual icon generated.
    // However, we should also provide a small version.
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
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#0078d4" class="lucide lucide-grid-2x2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/></svg>
      </div>
      
      <!-- Search Button -->
      <div class="w-10 h-10 rounded hover:bg-white/30 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer mx-1 text-gray-700 dark:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>

      <!-- Generated App Icon -->
      <div class="w-10 h-10 rounded bg-white/40 dark:bg-white/10 flex items-center justify-center transition-colors cursor-pointer mx-1 relative group">
        <div class="w-6 h-1 rounded-full bg-blue-500 absolute bottom-0"></div>
        <img v-if="generatedIcon" :src="generatedIcon" class="w-6 h-6 shadow-sm rounded-sm" alt="Win App Icon" />
        <div v-else class="w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-sm"></div>
      </div>
      
      <!-- Other App (Placeholder) -->
      <div class="w-10 h-10 rounded hover:bg-white/30 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer mx-1 text-gray-700 dark:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
      </div>
      
      <!-- Right Side Tray (Time, Battery, Wi-Fi) -->
      <div class="absolute right-2 flex items-center h-full gap-1 text-xs text-gray-800 dark:text-gray-200">
        <div class="px-2 h-10 rounded hover:bg-white/30 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer gap-2">
          <!-- Tray Icon Preview -->
          <img v-if="generatedIcon" :src="generatedIcon" class="w-4 h-4 opacity-90" alt="Tray Icon" />
          <div v-else class="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded-sm opacity-90"></div>
          
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wifi"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>
        </div>
        <div class="px-2 h-10 rounded hover:bg-white/30 dark:hover:bg-white/10 flex flex-col items-center justify-center transition-colors cursor-pointer leading-tight">
          <span>10:00 AM</span>
          <span>10/24/2023</span>
        </div>
      </div>
    </div>
  </div>
</template>
