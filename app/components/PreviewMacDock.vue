<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'

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
      size: 256,
      transparentBg: false
    })
  } catch (e) {
    console.error(e)
  }
}

watch([uploadedImage, backgroundId, padding, borderRadius], updateIcon, { immediate: true })
</script>

<template>
  <div class="h-48 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 transition-colors relative flex flex-col justify-between bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20macOS%20wallpaper%2C%20smooth%20gradient%20mesh%2C%20deep%20teal%20and%20violet%2C%20subtle%20noise%20grain%2C%20soft%20lighting%2C%20high%20detail&image_size=landscape_16_9')] bg-cover bg-center">
    <!-- Dark overlay for contrast -->
    <div class="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
    
    <!-- Mac Menu Bar (Tray) -->
    <div class="h-6 w-full bg-black/20 dark:bg-black/40 backdrop-blur-md relative z-10 flex items-center justify-between px-3 text-[11px] font-medium text-white shadow-sm border-b border-white/10">
      <div class="flex items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="opacity-90"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 1.44C10.54 6.44 8.78 5 6 5a5.22 5.22 0 0 0-5.24 5.31c0 5.61 5.34 11.69 8.24 11.69 1.5 0 2.88-1.06 4-1.06Z"/></svg>
        <span class="font-semibold">LogoWear</span>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
      </div>
      <div class="flex items-center gap-3">
        <!-- Tray Icon -->
        <img v-if="generatedIcon" :src="generatedIcon" class="w-[14px] h-[14px] opacity-90 rounded-[2px]" alt="Tray Icon" />
        <div v-else class="w-[14px] h-[14px] bg-white/50 rounded-[2px]"></div>
        
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-90"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-90"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>
        <span>Tue 10:00 AM</span>
      </div>
    </div>

    <!-- Dock Container -->
    <div class="relative z-10 mb-4 px-4 py-2 self-center bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/20 rounded-[2rem] flex items-center gap-3 shadow-xl">
      <!-- Finder Icon (placeholder) -->
      <div class="w-12 h-12 rounded-[10px] bg-blue-400 flex items-center justify-center text-white shadow-sm cursor-pointer hover:-translate-y-2 transition-transform duration-200 ease-out">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
      </div>
      
      <!-- Generated Icon -->
      <div class="w-12 h-12 cursor-pointer hover:-translate-y-2 transition-transform duration-200 ease-out relative group flex flex-col items-center">
        <!-- Tooltip -->
        <div class="absolute -top-10 bg-gray-800/80 text-white text-[11px] px-3 py-1 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          LogoWear
        </div>
        
        <img v-if="generatedIcon" :src="generatedIcon" class="w-full h-full " alt="Mac App Icon" />
        <div v-else class="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-2xl shadow-sm"></div>
        <!-- Dot indicator -->
        <div class="w-1 h-1 rounded-full bg-white/80 absolute -bottom-2.5"></div>
      </div>
      
      <!-- Divider -->
      <div class="w-[1px] h-10 bg-white/30 mx-1"></div>
      
      <!-- Trash Icon (placeholder) -->
      <div class="w-12 h-12 rounded-[10px] bg-white/40 flex items-center justify-center text-gray-800 shadow-sm cursor-pointer hover:-translate-y-2 transition-transform duration-200 ease-out">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
      </div>
    </div>
  </div>
</template>
