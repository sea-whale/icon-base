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
  <div class="grid grid-cols-2 gap-4">

    <!-- iOS Preview -->
    <div class="rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(45,52,48,0.12)] border-[5px] border-[#2d3430] transition-colors relative flex items-center justify-center bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20iOS%20home%20screen%20wallpaper%2C%20colorful%20bokeh%20blur%2C%20soft%20gradient%2C%20high%20detail&image_size=portrait_16_9')] bg-cover bg-center h-72">
      <div class="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      <!-- Notch -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-6 bg-[#2d3430] rounded-b-2xl z-20"></div>

      <!-- Status Bar -->
      <div class="absolute top-0 w-full h-6 flex justify-between items-center px-4 mt-1 z-20">
        <span class="text-[10px] font-bold text-white tracking-wide">9:41</span>
        <div class="flex gap-1 items-center text-white">
          <Signal :size="12" />
          <Wifi :size="12" />
          <Battery :size="14" />
        </div>
      </div>

      <!-- iOS Home Screen Grid -->
      <div class="relative z-10 w-full h-full p-4 pt-10 grid grid-cols-4 gap-x-3 gap-y-4 auto-rows-max place-items-center">
        <!-- Generated Icon -->
        <div class="flex flex-col items-center gap-1 group cursor-pointer hover:scale-95 transition-transform">
          <div class="w-11 h-11 rounded-[11px] shadow-md overflow-hidden bg-white/10 relative">
            <img v-if="iosIcon" :src="iosIcon" class="w-full h-full" alt="iOS App Icon" />
            <div v-else class="w-full h-full bg-[#e4e2de] animate-pulse"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>
          </div>
          <span class="text-[9px] text-white font-semibold drop-shadow-md">LogoWear</span>
        </div>

        <!-- Dummy Icons -->
        <div class="flex flex-col items-center gap-1 opacity-90" v-for="i in 3" :key="i">
          <div class="w-11 h-11 rounded-[11px] bg-white/30 backdrop-blur-md shadow-sm border border-white/20 flex items-center justify-center text-white">
            <Box :size="20" />
          </div>
          <span class="text-[9px] text-white font-semibold drop-shadow-md">App</span>
        </div>
      </div>

      <!-- iOS Dock -->
      <div class="absolute bottom-4 left-3.5 right-3.5 h-[56px] rounded-2xl bg-white/30 backdrop-blur-2xl border border-white/20 z-10 flex items-center justify-around px-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
        <div class="w-10 h-10 rounded-[11px] bg-[#34c759] flex items-center justify-center text-white shadow-sm"><MessageCircle :size="20" /></div>
        <div class="w-10 h-10 rounded-[11px] bg-[#007aff] flex items-center justify-center text-white shadow-sm"><Mail :size="20" /></div>
        <div class="w-10 h-10 rounded-[11px] bg-[#ff3b30] flex items-center justify-center text-white shadow-sm"><Music :size="20" /></div>
        <div class="w-10 h-10 rounded-[11px] bg-[#ff9500] flex items-center justify-center text-white shadow-sm"><Compass :size="20" /></div>
      </div>

      <!-- Home Indicator -->
      <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-white/90 rounded-full z-20 shadow-sm"></div>
    </div>

    <!-- Android Preview -->
    <div class="rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(45,52,48,0.12)] border-[5px] border-[#2d3430] transition-colors relative flex items-center justify-center bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20Android%20wallpaper%2C%20warm%20sunrise%20over%20a%20city%20skyline%2C%20soft%20blur%2C%20high%20detail&image_size=portrait_16_9')] bg-cover bg-center h-72">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

      <!-- Camera Hole -->
      <div class="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#2d3430] rounded-full z-20 shadow-inner"></div>

      <!-- Android Status Bar -->
      <div class="absolute top-0 w-full h-7 px-4 flex justify-between items-center z-20 text-white text-[10px] font-bold tracking-wide">
        <span>10:00</span>
        <div class="flex gap-1">
          <Wifi :size="12" />
          <Battery :size="12" />
        </div>
      </div>

      <!-- Search Widget -->
      <div class="absolute top-10 left-3.5 right-3.5 h-10 bg-white/95 rounded-full z-10 flex items-center px-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-md text-[#757c77]">
        <Search :size="18" class="text-[#536350]" />
        <div class="flex-1 ml-2 text-[13px] font-medium text-[#acb4ae]">Search...</div>
        <Mic :size="18" class="text-[#536350]" />
      </div>

      <!-- Android Home Screen Grid -->
      <div class="relative z-10 w-full h-full p-4 pt-24 grid grid-cols-4 gap-x-3 gap-y-4 auto-rows-max place-items-center">
        <!-- Dummy Icons -->
        <div class="flex flex-col items-center gap-1 opacity-90" v-for="i in 3" :key="i">
          <div class="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md shadow-sm border border-white/20 flex items-center justify-center text-white">
            <Hexagon :size="20" />
          </div>
          <span class="text-[9px] text-white font-medium drop-shadow-md">App</span>
        </div>

        <!-- Generated Icon -->
        <div class="flex flex-col items-center gap-1 group cursor-pointer hover:scale-95 transition-transform">
          <div class="w-11 h-11 shadow-md overflow-hidden bg-white/10 flex items-center justify-center relative rounded-full">
            <img v-if="androidIcon" :src="androidIcon" class="w-full h-full" alt="Android App Icon" />
            <div v-else class="w-full h-full bg-[#e4e2de] animate-pulse"></div>
          </div>
          <span class="text-[9px] text-white font-semibold drop-shadow-md">LogoWear</span>
        </div>
      </div>

      <!-- Android Dock -->
      <div class="absolute bottom-5 left-3.5 right-3.5 h-[56px] bg-white/30 backdrop-blur-2xl rounded-full border border-white/20 z-10 flex items-center justify-around px-3 shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
        <div class="w-9 h-9 rounded-full bg-[#007aff] flex items-center justify-center text-white shadow-sm"><Phone :size="18" /></div>
        <div class="w-9 h-9 rounded-full bg-[#34c759] flex items-center justify-center text-white shadow-sm"><MessageCircle :size="18" /></div>
        <div class="w-9 h-9 rounded-full bg-[#ff3b30] flex items-center justify-center text-white shadow-sm"><Mail :size="18" /></div>
        <div class="w-9 h-9 rounded-full bg-[#ff9500] flex items-center justify-center text-white shadow-sm"><Camera :size="18" /></div>
        <div class="w-9 h-9 rounded-full bg-slate-500 flex items-center justify-center text-white shadow-sm"><Settings :size="18" /></div>
      </div>

      <!-- Navigation Bar -->
      <div class="absolute bottom-0 w-full h-6 flex items-center justify-center z-20">
        <div class="w-10 h-1 bg-white/90 rounded-full shadow-sm"></div>
      </div>
    </div>
  </div>
</template>
