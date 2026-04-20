<script setup lang="ts">
import { inject, watch, ref, type Ref } from 'vue'
import { Search, ChevronLeft, ChevronRight, RotateCw } from 'lucide-vue-next'

const uploadedImage = inject<Ref<string | null>>('uploadedImage', ref(null))
const backgroundId = inject<Ref<string>>('backgroundId', ref('apple-dark'))
const padding = inject<Ref<number>>('padding', ref(20))
const borderRadius = inject<Ref<number>>('borderRadius', ref(22.5))
const isDarkMode = inject<Ref<boolean>>('isDarkMode', ref(true))

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
      size: 64,
      transparentBg: false
    })
  } catch (e) {
    console.error(e)
  }
}

watch([uploadedImage, backgroundId, padding, borderRadius], updateIcon, { immediate: true })
</script>

<template>
  <div class="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
    <!-- Browser Top Bar -->
    <div class="h-12 bg-gray-100 dark:bg-[#1c1c1e] flex items-center px-4 gap-2 select-none">
      <!-- Traffic Lights -->
      <div class="flex gap-2">
        <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
        <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
        <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
      </div>
      
      <!-- Browser Tabs Container -->
      <div class="flex-1 flex px-4 mt-2 h-10 items-end">
        <!-- Active Tab -->
        <div class="h-8 min-w-[200px] max-w-[240px] bg-white dark:bg-[#323233] rounded-t-lg flex items-center px-3 gap-2 shadow-[0_-2px_6px_rgba(0,0,0,0.05)] dark:shadow-none border-x border-t border-gray-200 dark:border-[#323233]">
          <img v-if="generatedIcon" :src="generatedIcon" class="w-4 h-4 object-contain" alt="Favicon" />
          <div v-else class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
          <span class="text-xs text-gray-700 dark:text-gray-200 font-medium truncate">LogoWear - Apple-Style...</span>
        </div>
        
        <!-- Inactive Tab -->
        <div class="h-8 min-w-[200px] max-w-[240px] flex items-center px-3 gap-2 opacity-50 hover:opacity-80 transition-opacity">
          <Search :size="16" />
          <span class="text-xs text-gray-700 dark:text-gray-200 font-medium truncate">Google Search</span>
        </div>
      </div>
    </div>
    
    <!-- Browser Address Bar Area -->
    <div class="h-10 bg-white dark:bg-[#323233] border-b border-gray-200 dark:border-[#1c1c1e] flex items-center px-4 gap-4">
      <div class="flex gap-2 text-gray-400 dark:text-gray-500">
        <ChevronLeft :size="16" />
        <ChevronRight :size="16" />
        <RotateCw :size="16" />
      </div>
      <div class="flex-1 h-6 bg-gray-100 dark:bg-[#1c1c1e] rounded flex items-center px-3 justify-center">
        <span class="text-[11px] text-gray-500 dark:text-gray-400">logowear.app</span>
      </div>
    </div>
  </div>
</template>
