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
    <div class="rounded-[2.5rem] overflow-hidden shadow-[0_12px_40px_rgba(45,52,48,0.15)] border-[8px] border-[#2d3430] transition-colors relative flex items-center justify-center bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20iOS%20home%20screen%20wallpaper%2C%20colorful%20bokeh%20blur%2C%20soft%20gradient%2C%20high%20detail&image_size=portrait_16_9')] bg-cover bg-center h-80">
      <div class="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      
      <!-- Notch -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-7 bg-[#2d3430] rounded-b-3xl z-20"></div>
      
      <!-- Status Bar -->
      <div class="absolute top-0 w-full h-7 flex justify-between items-center px-6 mt-1 z-20">
        <span class="text-[11px] font-bold text-white tracking-wide">9:41</span>
        <div class="flex gap-1.5 items-center text-white">
          <Signal :size="14" />
          <Wifi :size="14" />
          <Battery :size="16" />
        </div>
      </div>
      
      <!-- iOS Home Screen Grid -->
      <div class="relative z-10 w-full h-full p-6 pt-14 grid grid-cols-4 gap-x-4 gap-y-6 auto-rows-max place-items-center">
        <!-- Generated Icon -->
        <div class="flex flex-col items-center gap-1.5 group cursor-pointer hover:scale-95 transition-transform">
          <div class="w-14 h-14 rounded-[14px] shadow-lg overflow-hidden bg-white/10 relative">
            <img v-if="iosIcon" :src="iosIcon" class="w-full h-full" alt="iOS App Icon" />
            <div v-else class="w-full h-full bg-[#e4e2de] animate-pulse"></div>
            <!-- Glare effect -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>
          </div>
          <span class="text-[10px] text-white font-semibold drop-shadow-md">LogoWear</span>
        </div>
        
        <!-- Dummy Icons -->
        <div class="flex flex-col items-center gap-1.5 opacity-90" v-for="i in 3" :key="i">
          <div class="w-14 h-14 rounded-[14px] bg-white/30 backdrop-blur-md shadow-sm border border-white/20 flex items-center justify-center text-white">
            <Box :size="24" />
          </div>
          <span class="text-[10px] text-white font-semibold drop-shadow-md">App</span>
        </div>
      </div>
      
      <!-- iOS Dock -->
      <div class="absolute bottom-4 left-4 right-4 h-[76px] rounded-[2rem] bg-white/30 backdrop-blur-2xl border border-white/20 z-10 flex items-center justify-around px-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div class="w-[54px] h-[54px] rounded-[14px] bg-[#34c759] flex items-center justify-center text-white shadow-sm"><MessageCircle :size="26" /></div>
        <div class="w-[54px] h-[54px] rounded-[14px] bg-[#007aff] flex items-center justify-center text-white shadow-sm"><Mail :size="26" /></div>
        <div class="w-[54px] h-[54px] rounded-[14px] bg-[#ff3b30] flex items-center justify-center text-white shadow-sm"><Music :size="26" /></div>
        <div class="w-[54px] h-[54px] rounded-[14px] bg-[#ff9500] flex items-center justify-center text-white shadow-sm"><Compass :size="26" /></div>
      </div>
      
      <!-- Home Indicator -->
      <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/90 rounded-full z-20 shadow-sm"></div>
    </div>
    
    <!-- Android Preview -->
    <div class="rounded-[2.5rem] overflow-hidden shadow-[0_12px_40px_rgba(45,52,48,0.15)] border-[8px] border-[#2d3430] transition-colors relative flex items-center justify-center bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20Android%20wallpaper%2C%20warm%20sunrise%20over%20a%20city%20skyline%2C%20soft%20blur%2C%20high%20detail&image_size=portrait_16_9')] bg-cover bg-center h-80">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      
      <!-- Camera Hole -->
      <div class="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2d3430] rounded-full z-20 shadow-inner"></div>
      
      <!-- Android Status Bar -->
      <div class="absolute top-0 w-full h-8 px-6 flex justify-between items-center z-20 text-white text-[11px] font-bold tracking-wide">
        <span>10:00</span>
        <div class="flex gap-1.5">
          <Wifi :size="14" />
          <Battery :size="14" />
        </div>
      </div>
      
      <!-- Search Widget -->
      <div class="absolute top-12 left-5 right-5 h-[52px] bg-white/95 rounded-full z-10 flex items-center px-5 shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-md text-[#757c77]">
        <Search :size="22" class="text-[#536350]" />
        <div class="flex-1 ml-3 text-[15px] font-medium text-[#acb4ae]">Search...</div>
        <Mic :size="22" class="text-[#536350]" />
      </div>

      <!-- Android Home Screen Grid -->
      <div class="relative z-10 w-full h-full p-6 pt-32 grid grid-cols-4 gap-x-4 gap-y-6 auto-rows-max place-items-center">
        <!-- Dummy Icons -->
        <div class="flex flex-col items-center gap-1.5 opacity-90" v-for="i in 3" :key="i">
          <div class="w-[56px] h-[56px] rounded-full bg-white/30 backdrop-blur-md shadow-sm border border-white/20 flex items-center justify-center text-white">
            <Hexagon :size="26" />
          </div>
          <span class="text-[10px] text-white font-medium drop-shadow-md">App</span>
        </div>
        
        <!-- Generated Icon (Android style - respects user border radius) -->
        <div class="flex flex-col items-center gap-1.5 group cursor-pointer hover:scale-95 transition-transform">
          <div class="w-[56px] h-[56px] shadow-lg overflow-hidden bg-white/10 flex items-center justify-center relative rounded-full">
            <img v-if="androidIcon" :src="androidIcon" class="w-full h-full" alt="Android App Icon" />
            <div v-else class="w-full h-full bg-[#e4e2de] animate-pulse"></div>
          </div>
          <span class="text-[10px] text-white font-semibold drop-shadow-md">LogoWear</span>
        </div>
      </div>
      
      <!-- Android Dock -->
      <div class="absolute bottom-6 left-4 right-4 h-[72px] bg-white/30 backdrop-blur-2xl rounded-full border border-white/20 z-10 flex items-center justify-around px-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div class="w-[52px] h-[52px] rounded-full bg-[#007aff] flex items-center justify-center text-white shadow-sm"><Phone :size="24" /></div>
        <div class="w-[52px] h-[52px] rounded-full bg-[#34c759] flex items-center justify-center text-white shadow-sm"><MessageCircle :size="24" /></div>
        <div class="w-[52px] h-[52px] rounded-full bg-[#ff3b30] flex items-center justify-center text-white shadow-sm"><Mail :size="24" /></div>
        <div class="w-[52px] h-[52px] rounded-full bg-[#ff9500] flex items-center justify-center text-white shadow-sm"><Camera :size="24" /></div>
        <div class="w-[52px] h-[52px] rounded-full bg-slate-500 flex items-center justify-center text-white shadow-sm"><Settings :size="24" /></div>
      </div>
      
      <!-- Navigation Bar -->
      <div class="absolute bottom-0 w-full h-8 flex items-center justify-center z-20 pb-1">
        <div class="w-12 h-1.5 bg-white/90 rounded-full shadow-sm"></div>
      </div>
    </div>
  </div>
</template>
