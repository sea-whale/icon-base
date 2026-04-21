<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import { generateAllIcons } from '../utils/exportZip'
import { Download, Loader2, FileJson, FileImage } from 'lucide-vue-next'
import { useI18n } from '#imports'

const { t } = useI18n()

const uploadedImage = inject<Ref<string | null>>('uploadedImage', ref(null))
const backgroundId = inject<Ref<string>>('backgroundId', ref('apple-dark'))
const padding = inject<Ref<number>>('padding', ref(20))
const borderRadius = inject<Ref<number>>('borderRadius', ref(22.5))

const isExporting = ref(false)

const handleExport = async () => {
  if (!uploadedImage?.value || !backgroundId || !padding || !borderRadius) return
  isExporting.value = true
  try {
    await generateAllIcons({
      imageUrl: uploadedImage.value,
      backgroundId: backgroundId.value,
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
  <div class="shrink-0 pt-3 mt-3 border-t border-[#e4e2de]/50">
    <p class="text-xs font-semibold text-[#2d3430] mb-2">{{ t('panel.exportContains') }}</p>
    <div class="space-y-1.5 text-[11px] text-[#757c77]">
      <div class="flex items-center gap-2">
        <FileImage :size="12" class="text-[#4b6a9b] shrink-0" />
        <span class="text-[#2d3430] font-medium">favicon-16x16.png</span>
        <span class="text-[9px] font-mono text-[#536350] bg-[#536350]/10 px-1 py-px rounded">16x16</span>
      </div>
      <div class="flex items-center gap-2">
        <FileImage :size="12" class="text-[#4b6a9b] shrink-0" />
        <span class="text-[#2d3430] font-medium">favicon-32x32.png</span>
        <span class="text-[9px] font-mono text-[#536350] bg-[#536350]/10 px-1 py-px rounded">32x32</span>
      </div>
      <div class="flex items-center gap-2">
        <img src="/favicon.ico" class="w-3 h-3 opacity-60 shrink-0" alt="" />
        <span class="text-[#2d3430] font-medium">favicon.ico</span>
        <span class="text-[9px] font-mono text-[#536350] bg-[#536350]/10 px-1 py-px rounded">32x32</span>
      </div>
      <div class="flex items-center gap-2">
        <FileImage :size="12" class="text-[#3c825a] shrink-0" />
        <span class="text-[#2d3430] font-medium">apple-touch-icon.png</span>
        <span class="text-[9px] font-mono text-[#536350] bg-[#536350]/10 px-1 py-px rounded">180x180</span>
      </div>
      <div class="flex items-center gap-2">
        <FileImage :size="12" class="text-[#d97736] shrink-0" />
        <span class="text-[#2d3430] font-medium">android-chrome-*.png</span>
        <span class="text-[9px] font-mono text-[#536350] bg-[#536350]/10 px-1 py-px rounded">192/512</span>
      </div>
      <div class="flex items-center gap-2">
        <FileImage :size="12" class="text-[#d97736] shrink-0" />
        <span class="text-[#2d3430] font-medium">icon-maskable-*.png</span>
        <span class="text-[9px] font-mono text-[#536350] bg-[#536350]/10 px-1 py-px rounded">512x512</span>
      </div>
      <div class="flex items-center gap-2">
        <FileImage :size="12" class="text-[#ec4899] shrink-0" />
        <span class="text-[#2d3430] font-medium">icon-sharp-512x512.png</span>
        <span class="text-[9px] font-mono text-[#536350] bg-[#536350]/10 px-1 py-px rounded">512 / {{ t('panel.sharpCorner') }}</span>
      </div>
      <div class="flex items-center gap-2">
        <FileImage :size="12" class="text-[#8b5cf6] shrink-0" />
        <span class="text-[#2d3430] font-medium">desktop-*.png</span>
        <span class="text-[9px] font-mono text-[#536350] bg-[#536350]/10 px-1 py-px rounded">256/1024</span>
      </div>
      <div class="flex items-center gap-2">
        <FileJson :size="12" class="text-[#a84f5e] shrink-0" />
        <span class="text-[#2d3430] font-medium">site.webmanifest</span>
        <span class="text-[9px] font-mono text-[#536350] bg-[#536350]/10 px-1 py-px rounded">JSON</span>
      </div>
    </div>

    <button
      @click="handleExport"
      :disabled="isExporting"
      class="w-full mt-3 py-2.5 px-4 bg-[#536350] hover:bg-[#475744] text-[#ecfee5] font-semibold rounded-xl transition-all shadow-[0_8px_24px_rgba(83,99,80,0.15)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
    >
      <template v-if="isExporting">
        <Loader2 class="animate-spin h-4 w-4 text-[#ecfee5]" />
        {{ t('panel.exporting') }}
      </template>
      <template v-else>
        <Download :size="16" />
        <span>{{ t('panel.exportZip') }}</span>
      </template>
    </button>
  </div>
</template>