<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import { generateAllIcons } from '../utils/exportZip'

const uploadedImage = inject<Ref<string | null>>('uploadedImage')
const backgroundColor = inject<Ref<string>>('backgroundColor')
const padding = inject<Ref<number>>('padding')
const borderRadius = inject<Ref<number>>('borderRadius')

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isExporting = ref(false)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) processFile(file)
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file.')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    if (uploadedImage) uploadedImage.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleExport = async () => {
  if (!uploadedImage?.value || !backgroundColor || !padding || !borderRadius) return
  isExporting.value = true
  try {
    await generateAllIcons({
      imageUrl: uploadedImage.value,
      backgroundColor: backgroundColor.value,
      padding: padding.value,
      borderRadius: borderRadius.value
    })
  } catch (error) {
    console.error('Failed to export icons:', error)
    alert('Failed to export icons. Please try again.')
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Upload Area -->
    <div 
      class="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden"
      :class="[
        isDragging 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
        uploadedImage ? 'h-32' : 'h-48'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerUpload"
    >
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        accept="image/png, image/jpeg, image/svg+xml, image/webp"
        @change="handleFileUpload" 
      />
      
      <template v-if="!uploadedImage">
        <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload text-gray-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        </div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">点击或拖拽图片上传</p>
        <p class="text-xs text-gray-500 mt-1">支持 PNG, SVG, WEBP (最大 5MB)</p>
      </template>
      <template v-else>
        <div class="absolute inset-0 w-full h-full opacity-20" :style="{ backgroundImage: `url(${uploadedImage})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(8px)' }"></div>
        <div class="relative z-10 flex flex-col items-center">
          <div class="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-md shadow border border-white/20 p-2 mb-2">
            <img :src="uploadedImage" class="w-full h-full object-contain" />
          </div>
          <p class="text-xs font-medium text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-black/50 px-2 py-1 rounded backdrop-blur-md">更换图片</p>
        </div>
      </template>
    </div>

    <template v-if="uploadedImage">
      <!-- Background Color -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">背景颜色</label>
          <span class="text-xs font-mono text-gray-500">{{ backgroundColor }}</span>
        </div>
        <div class="flex items-center gap-3">
          <input 
            type="color" 
            v-model="backgroundColor" 
            class="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
          />
          <div class="flex-1 flex gap-2">
            <button @click="backgroundColor = '#000000'" class="w-6 h-6 rounded-full bg-black border border-gray-300 shadow-sm" title="纯黑"></button>
            <button @click="backgroundColor = '#FFFFFF'" class="w-6 h-6 rounded-full bg-white border border-gray-300 shadow-sm" title="纯白"></button>
            <button @click="backgroundColor = '#1c1c1e'" class="w-6 h-6 rounded-full bg-[#1c1c1e] border border-gray-300 shadow-sm" title="Apple 深色"></button>
            <button @click="backgroundColor = '#f5f5f7'" class="w-6 h-6 rounded-full bg-[#f5f5f7] border border-gray-300 shadow-sm" title="Apple 浅色"></button>
            <button @click="backgroundColor = '#007aff'" class="w-6 h-6 rounded-full bg-[#007aff] border border-gray-300 shadow-sm" title="Apple 蓝色"></button>
          </div>
        </div>
      </div>

      <!-- Padding -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">图标缩放间距</label>
          <span class="text-xs font-mono text-gray-500">{{ padding }}%</span>
        </div>
        <input 
          type="range" 
          v-model.number="padding" 
          min="0" 
          max="50" 
          class="w-full accent-blue-500"
        />
      </div>

      <!-- Border Radius -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">圆角曲率</label>
          <span class="text-xs font-mono text-gray-500">{{ borderRadius }}%</span>
        </div>
        <input 
          type="range" 
          v-model.number="borderRadius" 
          min="0" 
          max="50" 
          class="w-full accent-blue-500"
        />
      </div>

      <!-- Export Button -->
      <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          @click="handleExport" 
          :disabled="isExporting"
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <template v-if="isExporting">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            打包生成中...
          </template>
          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            一键导出所有尺寸
          </template>
        </button>
        <p class="text-xs text-center text-gray-500 mt-3">
          自动生成 favicon, apple-touch-icon, android-chrome 等多尺寸规范图标
        </p>
      </div>
    </template>
  </div>
</template>
