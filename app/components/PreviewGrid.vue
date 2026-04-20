<script setup lang="ts">
import PreviewBrowser from './PreviewBrowser.vue'
import PreviewMacDock from './PreviewMacDock.vue'
import PreviewWinTaskbar from './PreviewWinTaskbar.vue'
import PreviewMobile from './PreviewMobile.vue'
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-10 pb-20">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <!-- Browser Tabs Preview -->
      <div class="col-span-1 xl:col-span-2">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">浏览器标签页预览</h3>
        <PreviewBrowser />
      </div>

      <!-- macOS Dock Preview -->
      <div>
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">macOS Dock 预览</h3>
        <PreviewMacDock />
      </div>

      <!-- Windows Taskbar Preview -->
      <div>
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Windows 任务栏预览</h3>
        <PreviewWinTaskbar />
      </div>

      <!-- Mobile Home Screen Preview (iOS & Android Style combined or split) -->
      <div class="col-span-1 xl:col-span-2">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">移动端主屏幕预览</h3>
        <PreviewMobile />
      </div>
    </div>
  </div>
</template>
