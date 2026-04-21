<script setup lang="ts">
import PreviewBrowser from './PreviewBrowser.vue'
import PreviewMacDock from './PreviewMacDock.vue'
import PreviewWinTaskbar from './PreviewWinTaskbar.vue'
import PreviewMobile from './PreviewMobile.vue'
import { useI18n } from '#imports'

const { t } = useI18n()
</script>

<template>
  <div class="space-y-4">
    <!-- Browser Tabs Preview -->
    <div class="rounded-xl">
      <PreviewBrowser />
    </div>

    <!-- Dock + Windows full width row -->
    <div class="grid grid-cols-1 gap-4">
      <div class="rounded-xl">
        <PreviewMacDock />
      </div>
      <div class="rounded-xl">
        <PreviewWinTaskbar />
      </div>
    </div>

    <!-- Mobile Preview -->
    <div class="rounded-xl">
      <PreviewMobile />
    </div>
  </div>
</template>
