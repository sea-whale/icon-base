<script setup lang="ts">
import { useHead, useI18n } from '#imports'
import { ref, provide, onMounted } from 'vue'
import { ImageIcon } from 'lucide-vue-next'

const { t, locale, setLocale } = useI18n()

useHead({
  title: 'LogoWear - Apple-Style Icon Generator',
  bodyAttrs: {
    class: 'antialiased bg-gray-50 text-gray-900 transition-colors duration-200 min-h-screen'
  }
})

// Global State
const uploadedImage = ref<string | null>(null)
const backgroundId = ref<string>('apple-dark') // Default apple-like dark background
const padding = ref<number>(20) // Percentage of padding (0-50)
const borderRadius = ref<number>(22.5) // Apple standard is roughly 22.5% of width
const isDarkMode = ref<boolean>(false) // Force light mode always

// Provide state to components
provide('uploadedImage', uploadedImage)
provide('backgroundId', backgroundId)
provide('padding', padding)
provide('borderRadius', borderRadius)
provide('isDarkMode', isDarkMode)

const toggleLanguage = () => {
  setLocale(locale.value === 'zh' ? 'en' : 'zh')
}

onMounted(() => {
  document.documentElement.classList.remove('dark')
})
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans">
    <!-- Header -->
    <header class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="LogoWear" class="w-8 h-8 rounded-lg shadow-sm object-cover" />
        <h1 class="text-xl font-semibold tracking-tight">{{ t('app.title') }}</h1>
      </div>
      <div class="flex items-center gap-4">
        <button 
          @click="toggleLanguage" 
          class="h-8 px-3 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
          title="Toggle Language"
        >
          {{ locale === 'zh' ? 'EN' : '中' }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-4rem)]">
      <!-- Left Panel: Controls -->
      <aside class="w-full lg:w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1e] p-6 overflow-y-auto shrink-0 flex flex-col gap-8 custom-scrollbar">
        <ControlPanel />
      </aside>

      <!-- Right Panel: Previews -->
      <section class="flex-1 bg-gray-50 dark:bg-[#121212] overflow-y-auto p-6 lg:p-10 relative custom-scrollbar">
        <PreviewGrid v-if="uploadedImage" />
        <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <div class="w-24 h-24 mb-6 opacity-20 border-4 border-dashed border-current rounded-3xl flex items-center justify-center relative overflow-hidden group">
            <ImageIcon :size="32" class="group-hover:scale-110 transition-transform" />
          </div>
          <p class="text-xl font-medium text-gray-700">{{ t('app.uploadPrompt') }}</p>
          <p class="text-sm mt-2 max-w-md text-center">{{ t('app.uploadDesc') }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
/* Custom Scrollbar for sleek UI */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333333;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
