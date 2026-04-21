<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import { generateAllIcons } from '../utils/exportZip'
import { Download, Loader2, Info, FileJson, FileImage, Layers } from 'lucide-vue-next'
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
  <div class="flex flex-col lg:flex-row gap-10 items-start">
    <div class="w-full lg:w-1/3 shrink-0">
      <div class="sticky top-6">
        <h3 class="text-2xl font-extrabold text-[#2d3430] mb-3 tracking-tight">{{ t('panel.exportTitle', '导出全部平台资产') }}</h3>
        <p class="text-[15px] text-[#757c77] mb-8 leading-relaxed">
          {{ t('panel.exportDesc') }}
        </p>
        
        <button 
          @click="handleExport" 
          :disabled="isExporting"
          class="w-full py-4 px-6 bg-[#536350] hover:bg-[#475744] text-[#ecfee5] font-semibold rounded-[1.25rem] transition-all shadow-[0_12px_32px_rgba(83,99,80,0.15)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          <template v-if="isExporting">
            <Loader2 class="animate-spin -ml-1 h-5 w-5 text-[#ecfee5]" />
            {{ t('panel.exporting') }}
          </template>
          <template v-else>
            <Download :size="22" class="group-hover:-translate-y-1 transition-transform" />
            <span class="text-lg">{{ t('panel.exportZip') }}</span>
          </template>
        </button>
      </div>
    </div>

    <div class="w-full lg:w-2/3">
      <div class="bg-[#fdfbf7] rounded-[2rem] p-6 sm:p-8 border border-[#e4e2de] shadow-sm relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#536350]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div class="flex items-center gap-3 mb-8 text-[#2d3430] font-bold text-lg border-b border-[#e4e2de]/80 pb-5 relative z-10">
          <div class="w-8 h-8 rounded-lg bg-[#536350]/10 flex items-center justify-center">
            <Layers :size="18" class="text-[#536350]" />
          </div>
          {{ t('panel.exportContains') }}
        </div>

        <div class="relative z-10 ml-6 border-l-2 border-[#e4e2de] space-y-10 pb-4">
          <div class="relative pl-8 group">
            <div class="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-white border-2 border-[#e4e2de] shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-[#536350]/30 transition-all">
              <img src="/favicon.ico" class="w-5 h-5 opacity-60 grayscale" alt="" />
            </div>
            <div>
              <div class="flex items-baseline gap-2.5 mb-1.5 pt-1">
                <span class="font-bold text-[#2d3430]">favicon.ico</span>
                <span class="text-[10px] font-mono font-semibold text-[#536350] bg-[#536350]/10 px-1.5 py-0.5 rounded-md">32x32</span>
              </div>
              <p class="text-[13px] text-[#757c77] leading-relaxed">{{ t('panel.exportBreakdown.ico') }}</p>
            </div>
          </div>

          <div class="relative pl-8 group">
            <div class="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-white border-2 border-[#e4e2de] shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-[#4b6a9b]/30 transition-all">
              <FileImage :size="20" class="text-[#4b6a9b]" />
            </div>
            <div>
              <div class="flex items-baseline gap-2.5 mb-1.5 pt-1">
                <span class="font-bold text-[#2d3430]">apple-touch-icon.png</span>
                <span class="text-[10px] font-mono font-semibold text-[#536350] bg-[#536350]/10 px-1.5 py-0.5 rounded-md">180x180</span>
              </div>
              <p class="text-[13px] text-[#757c77] leading-relaxed">{{ t('panel.exportBreakdown.apple') }}</p>
            </div>
          </div>

          <div class="relative pl-8 group">
            <div class="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-white border-2 border-[#e4e2de] shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-[#3c825a]/30 transition-all">
              <FileImage :size="20" class="text-[#3c825a]" />
            </div>
            <div>
              <div class="flex items-baseline gap-2.5 mb-1.5 pt-1">
                <span class="font-bold text-[#2d3430]">android-chrome-*.png</span>
                <span class="text-[10px] font-mono font-semibold text-[#536350] bg-[#536350]/10 px-1.5 py-0.5 rounded-md">192/512</span>
              </div>
              <p class="text-[13px] text-[#757c77] leading-relaxed">{{ t('panel.exportBreakdown.android') }}</p>
            </div>
          </div>

          <div class="relative pl-8 group">
            <div class="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-white border-2 border-[#e4e2de] shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-[#d97736]/30 transition-all">
              <FileImage :size="20" class="text-[#d97736]" />
            </div>
            <div>
              <div class="flex items-baseline gap-2.5 mb-1.5 pt-1">
                <span class="font-bold text-[#2d3430]">favicon-*.png</span>
                <span class="text-[10px] font-mono font-semibold text-[#536350] bg-[#536350]/10 px-1.5 py-0.5 rounded-md">16/32</span>
              </div>
              <p class="text-[13px] text-[#757c77] leading-relaxed">{{ t('panel.exportBreakdown.favicon') }}</p>
            </div>
          </div>

          <div class="relative pl-8 group">
            <div class="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-white border-2 border-[#e4e2de] shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-[#a84f5e]/30 transition-all">
              <FileJson :size="20" class="text-[#a84f5e]" />
            </div>
            <div>
              <div class="flex items-baseline gap-2.5 mb-1.5 pt-1">
                <span class="font-bold text-[#2d3430]">site.webmanifest</span>
                <span class="text-[10px] font-mono font-semibold text-[#536350] bg-[#536350]/10 px-1.5 py-0.5 rounded-md">JSON</span>
              </div>
              <p class="text-[13px] text-[#757c77] leading-relaxed">{{ t('panel.exportBreakdown.manifest') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>