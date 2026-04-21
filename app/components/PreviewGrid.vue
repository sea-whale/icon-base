<script setup lang="ts">
import PreviewBrowser from './PreviewBrowser.vue'
import PreviewMacDock from './PreviewMacDock.vue'
import PreviewWinTaskbar from './PreviewWinTaskbar.vue'
import PreviewMobile from './PreviewMobile.vue'
import { useI18n } from '#imports'

const { t } = useI18n()
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Browser Tabs Preview -->
      <div class="col-span-1 md:col-span-2">
        <h3 class="text-xs font-bold text-[#757c77] uppercase tracking-widest mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#536350]"></span>
          {{ t('preview.browser') }}
        </h3>
        <PreviewBrowser />
      </div>

      <!-- macOS Dock Preview -->
      <div>
        <h3 class="text-xs font-bold text-[#757c77] uppercase tracking-widest mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#536350]"></span>
          {{ t('preview.macDock') }}
        </h3>
        <PreviewMacDock />
      </div>

      <!-- Windows Taskbar Preview -->
      <div>
        <h3 class="text-xs font-bold text-[#757c77] uppercase tracking-widest mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#536350]"></span>
          {{ t('preview.winTaskbar') }}
        </h3>
        <PreviewWinTaskbar />
      </div>

      <!-- Mobile Home Screen Preview (iOS & Android Style combined or split) -->
      <div class="col-span-1 md:col-span-2">
        <h3 class="text-xs font-bold text-[#757c77] uppercase tracking-widest mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#536350]"></span>
          {{ t('preview.mobile') }}
        </h3>
        <PreviewMobile />
      </div>
    </div>
  </div>
</template>
