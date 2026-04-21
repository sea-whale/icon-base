<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'
import { Signal, Wifi, Battery, Box, MessageCircle, Mail, Music, Compass, Search, Mic, Hexagon, Phone, Camera, Settings } from 'lucide-vue-next'

const uploadedImage = inject<Ref<string | null>>('uploadedImage', ref(null))
const backgroundId = inject<Ref<string>>('backgroundId', ref('apple-dark'))
const padding = inject<Ref<number>>('padding', ref(20))
const borderRadius = inject<Ref<number>>('borderRadius', ref(22.5))

const iosIcon = ref<string>('')
const androidIcon = ref<string>('')

const updateIcons = async () => {
  if (!uploadedImage?.value || !backgroundId || !padding || !borderRadius) return
  
  try {
    const { generateIconDataUrl } = await import('../utils/iconGenerator')
    iosIcon.value = await generateIconDataUrl({
      imageUrl: uploadedImage.value,
      backgroundId: backgroundId.value,
      padding: padding.value,
      borderRadius: 22.5,
      size: 180,
      transparentBg: false
    })
    
    androidIcon.value = await generateIconDataUrl({
      imageUrl: uploadedImage.value,
      backgroundId: backgroundId.value,
      padding: padding.value,
      borderRadius: borderRadius.value,
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
      
      <!-- Status Bar -->
      <div class="absolute top-0 w-full h-6 flex justify-between items-center px-4 mt-2 z-20">
        <span class="text-[10px] font-medium text-white">9:41</span>
        <div class="flex gap-1 items-center text-white">
          <Signal :size="12" />
          <Wifi :size="12" />
          <Battery :size="14" />
        </div>
      </div>
      
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
            <Box :size="24" />
          </div>
          <span class="text-[10px] text-white font-medium drop-shadow-md">App</span>
        </div>
      </div>
      
      <!-- iOS Dock -->
      <div class="absolute bottom-4 left-4 right-4 h-[72px] rounded-[1.8rem] bg-white/20 backdrop-blur-xl border border-white/10 z-10 flex items-center justify-around px-2 shadow-lg">
        <div class="w-[52px] h-[52px] rounded-[14px] bg-green-500 flex items-center justify-center text-white opacity-90"><MessageCircle :size="24" /></div>
        <div class="w-[52px] h-[52px] rounded-[14px] bg-blue-500 flex items-center justify-center text-white opacity-90"><Mail :size="24" /></div>
        <div class="w-[52px] h-[52px] rounded-[14px] bg-red-500 flex items-center justify-center text-white opacity-90"><Music :size="24" /></div>
        <div class="w-[52px] h-[52px] rounded-[14px] bg-orange-500 flex items-center justify-center text-white opacity-90"><Compass :size="24" /></div>
      </div>
    </div>
    
    <!-- Android Preview -->
    <div class="rounded-[2.5rem] overflow-hidden shadow-xl border-[6px] border-gray-800 dark:border-gray-900 transition-colors relative flex items-center justify-center bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20Android%20wallpaper%2C%20warm%20sunrise%20over%20a%20city%20skyline%2C%20soft%20blur%2C%20high%20detail&image_size=portrait_16_9')] bg-cover bg-center h-80">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <!-- Android Status Bar -->
      <div class="absolute top-0 w-full h-6 px-4 flex justify-between items-center z-20 text-white text-[10px] font-medium">
        <span>10:00</span>
        <div class="flex gap-1">
          <Wifi :size="12" />
          <Battery :size="12" />
        </div>
      </div>
      
      <!-- Search Widget -->
      <div class="absolute top-10 left-4 right-4 h-12 bg-white/90 rounded-full z-10 flex items-center px-4 shadow-sm backdrop-blur-sm text-gray-500">
        <Search :size="20" />
        <div class="flex-1 ml-3 text-sm">Search</div>
        <Mic :size="20" />
      </div>

      <!-- Android Home Screen Grid -->
      <div class="relative z-10 w-full h-full p-6 pt-28 grid grid-cols-4 gap-4 auto-rows-max place-items-center">
        <!-- Dummy Icons -->
        <div class="flex flex-col items-center gap-1 opacity-80" v-for="i in 3" :key="i">
          <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white/50">
            <Hexagon :size="24" />
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
      
      <!-- Android Dock -->
      <div class="absolute bottom-6 left-4 right-4 h-16 bg-white/20 backdrop-blur-md rounded-full border border-white/10 z-10 flex items-center justify-around px-4">
        <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white"><Phone :size="24" /></div>
        <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white"><MessageCircle :size="24" /></div>
        <div class="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white"><Mail :size="24" /></div>
        <div class="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white"><Camera :size="24" /></div>
        <div class="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white"><Settings :size="24" /></div>
      </div>
      
      <!-- Navigation Bar -->
      <div class="absolute bottom-0 w-full h-10 flex items-center justify-center z-20 pb-2">
        <div class="w-1/3 h-1 bg-white/50 rounded-full"></div>
      </div>
    </div>
  </div>
</template>
