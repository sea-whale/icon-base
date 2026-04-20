<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'

const uploadedImage = inject<Ref<string | null>>('uploadedImage')
const backgroundId = inject<Ref<string>>('backgroundId')
const padding = inject<Ref<number>>('padding')
const borderRadius = inject<Ref<number>>('borderRadius')

const iosIcon = ref<string>('')
const androidIcon = ref<string>('')

const updateIcons = async () => {
  if (!uploadedImage?.value || !backgroundId || !padding || !borderRadius) return
  
  try {
    const { generateIconDataUrl } = await import('../utils/iconGenerator')
    // iOS: Force standard border radius for preview (iOS does it automatically anyway)
    iosIcon.value = await generateIconDataUrl({
      imageUrl: uploadedImage.value,
      backgroundId: backgroundId.value,
      padding: padding.value,
      borderRadius: 22.5, // Force iOS radius for visual preview
      size: 180,
      transparentBg: false
    })
    
    // Android: often uses circular or slight rounded corners, but we show the raw generated one
    androidIcon.value = await generateIconDataUrl({
      imageUrl: uploadedImage.value,
      backgroundId: backgroundId.value,
      padding: padding.value,
      borderRadius: borderRadius.value, // User selected
      size: 192,
      transparentBg: false
    })
  } catch (e) {
    console.error(e)
  }
}

watch([uploadedImage, backgroundId, padding, borderRadius], updateIcons, { immediate: true })
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    
    <!-- iOS Preview -->
    <div class="rounded-[2.5rem] overflow-hidden shadow-xl border-[6px] border-gray-800 dark:border-gray-900 transition-colors relative flex items-center justify-center bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20iOS%20home%20screen%20wallpaper%2C%20colorful%20bokeh%20blur%2C%20soft%20gradient%2C%20high%20detail&image_size=portrait_16_9')] bg-cover bg-center h-80">
      <div class="absolute inset-0 bg-black/20"></div>
      
      <!-- Notch -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 dark:bg-gray-900 rounded-b-xl z-20"></div>
      
      <!-- iOS Home Screen Grid -->
      <div class="relative z-10 w-full h-full p-6 pt-12 grid grid-cols-4 gap-4 auto-rows-max place-items-center">
        <!-- Generated Icon -->
        <div class="flex flex-col items-center gap-1 group cursor-pointer hover:scale-95 transition-transform">
          <div class="w-14 h-14 rounded-2xl shadow-sm overflow-hidden bg-white/10 relative">
            <img v-if="iosIcon" :src="iosIcon" class="w-full h-full" alt="iOS App Icon" />
            <div v-else class="w-full h-full bg-gray-300 dark:bg-gray-700"></div>
            <!-- Glare effect -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
          </div>
          <span class="text-[10px] text-white font-medium drop-shadow-md">LogoWear</span>
        </div>
        
        <!-- Dummy Icons -->
        <div class="flex flex-col items-center gap-1 opacity-80" v-for="i in 3" :key="i">
          <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <span class="text-[10px] text-white font-medium drop-shadow-md">App</span>
        </div>
      </div>
      
      <!-- iOS Dock -->
      <div class="absolute bottom-4 left-4 right-4 h-[72px] rounded-[1.8rem] bg-white/20 backdrop-blur-xl border border-white/10 z-10 flex items-center justify-around px-2 shadow-lg">
        <div class="w-[52px] h-[52px] rounded-[14px] bg-green-500 flex items-center justify-center text-white opacity-90"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg></div>
        <div class="w-[52px] h-[52px] rounded-[14px] bg-blue-500 flex items-center justify-center text-white opacity-90"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div>
        <div class="w-[52px] h-[52px] rounded-[14px] bg-red-500 flex items-center justify-center text-white opacity-90"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
        <div class="w-[52px] h-[52px] rounded-[14px] bg-orange-500 flex items-center justify-center text-white opacity-90"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg></div>
      </div>
    </div>
    
    <!-- Android Preview -->
    <div class="rounded-[2.5rem] overflow-hidden shadow-xl border-[6px] border-gray-800 dark:border-gray-900 transition-colors relative flex items-center justify-center bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20Android%20wallpaper%2C%20warm%20sunrise%20over%20a%20city%20skyline%2C%20soft%20blur%2C%20high%20detail&image_size=portrait_16_9')] bg-cover bg-center h-80">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <!-- Android Status Bar -->
      <div class="absolute top-0 w-full h-6 px-4 flex justify-between items-center z-20 text-white text-[10px] font-medium">
        <span>10:00</span>
        <div class="flex gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>
        </div>
      </div>
      
      <!-- Search Widget -->
      <div class="absolute top-10 left-4 right-4 h-12 bg-white/90 dark:bg-[#1c1c1e]/90 rounded-full z-10 flex items-center px-4 shadow-sm backdrop-blur-sm text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <div class="flex-1 ml-3 text-sm">Search</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
      </div>

      <!-- Android Home Screen Grid -->
      <div class="relative z-10 w-full h-full p-6 pt-28 grid grid-cols-4 gap-4 auto-rows-max place-items-center">
        <!-- Dummy Icons -->
        <div class="flex flex-col items-center gap-1 opacity-80" v-for="i in 3" :key="i">
          <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hexagon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </div>
          <span class="text-[10px] text-white font-medium drop-shadow-md">App</span>
        </div>
        
        <!-- Generated Icon (Android style - respects user border radius) -->
        <div class="flex flex-col items-center gap-1 group cursor-pointer hover:scale-95 transition-transform">
          <div class="w-14 h-14 shadow-sm overflow-hidden bg-white/10 flex items-center justify-center relative rounded-full">
            <img v-if="androidIcon" :src="androidIcon" class="w-full h-full" alt="Android App Icon" />
            <div v-else class="w-full h-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <span class="text-[10px] text-white font-medium drop-shadow-md">LogoWear</span>
        </div>
      </div>
      
      <!-- Navigation Bar -->
      <div class="absolute bottom-0 w-full h-10 flex items-center justify-center z-20 pb-2">
        <div class="w-24 h-1 bg-white/50 rounded-full"></div>
      </div>
    </div>
    
  </div>
</template>
