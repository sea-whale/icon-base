<script setup lang="ts">
import { useHead } from '#imports'
import { ref, provide } from 'vue'

useHead({
  title: 'LogoWear',
  bodyAttrs: {
    class: 'antialiased bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-gray-100 transition-colors duration-200 min-h-screen'
  }
})

// Global State
const uploadedImage = ref<string | null>(null)
const backgroundColor = ref<string>('#FFFFFF')
const padding = ref<number>(20) // Percentage of padding (0-50)
const borderRadius = ref<number>(22.5) // Apple standard is roughly 22.5% of width
const isDarkMode = ref<boolean>(false)

// Provide state to components
provide('uploadedImage', uploadedImage)
provide('backgroundColor', backgroundColor)
provide('padding', padding)
provide('borderRadius', borderRadius)
provide('isDarkMode', isDarkMode)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center shadow-sm">
          <span class="text-white dark:text-black font-bold text-sm">LW</span>
        </div>
        <h1 class="text-xl font-semibold tracking-tight">LogoWear</h1>
      </div>
      <div class="flex items-center gap-4">
        <button 
          @click="toggleTheme" 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle Dark Mode"
        >
          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-4rem)]">
      <!-- Left Panel: Controls -->
      <aside class="w-full lg:w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1e] p-6 overflow-y-auto shrink-0 flex flex-col gap-8">
        <ControlPanel />
      </aside>

      <!-- Right Panel: Previews -->
      <section class="flex-1 bg-gray-50 dark:bg-[#121212] overflow-y-auto p-6 lg:p-10 relative">
        <PreviewGrid v-if="uploadedImage" />
        <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <div class="w-24 h-24 mb-6 opacity-20 border-4 border-dashed border-current rounded-3xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <p class="text-lg font-medium">Upload an image to start previewing</p>
          <p class="text-sm mt-2">Generate standard icons for all platforms</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
/* Custom Scrollbar for sleek UI */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #333333;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
