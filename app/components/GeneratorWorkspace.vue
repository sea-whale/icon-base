<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useI18n } from '#imports'
import ControlPanel from './ControlPanel.vue'
import ExportSection from './ExportSection.vue'
import PreviewGrid from './PreviewGrid.vue'
import type { IconShapeMode } from '../utils/iconGenerator'
import type { SeoPageKey } from '../utils/site'

const props = withDefaults(defineProps<{
  pageKey: SeoPageKey
  defaultBackgroundId?: string
}>(), {
  defaultBackgroundId: 'glass-green-glow'
})

const { t } = useI18n()

const uploadedImage = ref<string | null>('/logo.svg')
const backgroundId = ref<string>(props.defaultBackgroundId)
const padding = ref<number>(20)
const borderRadius = ref<number>(22.5)
const shapeMode = ref<IconShapeMode>('rounded-rect')

const isDefaultImage = computed(() => uploadedImage.value === '/logo.svg')

provide('uploadedImage', uploadedImage)
provide('backgroundId', backgroundId)
provide('padding', padding)
provide('borderRadius', borderRadius)
provide('shapeMode', shapeMode)
provide('isDefaultImage', isDefaultImage)
</script>

<template>
  <section id="generator" class="relative py-8 lg:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="mb-6 max-w-3xl">
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
          {{ t('generator.workspaceTitle') }}
        </h2>
        <p class="mt-2 text-base text-slate-600">
          {{ t(`pages.${pageKey}.generatorIntro`) }}
        </p>
      </div>

      <div class="lg:grid lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)] lg:gap-6 xl:grid-cols-[minmax(340px,0.72fr)_minmax(0,1.28fr)]">
        <div
          class="order-2 rounded-2xl bg-[#f0efed] p-4 sm:p-6 min-h-[600px] lg:order-1 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div class="mb-4">
            <h3 class="text-lg font-semibold tracking-tight text-slate-900">
              {{ t('generator.previewTitle') }}
            </h3>
            <p class="mt-1 text-sm text-slate-500">
              {{ t(`pages.${pageKey}.generatorPreview`) }}
            </p>
          </div>
          <PreviewGrid />
        </div>

        <div
          class="order-1 mb-6 rounded-2xl border border-[#e4e2de] bg-white/80 p-5 backdrop-blur-xl lg:order-2 lg:mb-0 lg:min-h-[600px] lg:p-6">
          <div class="mb-4 max-w-2xl">
            <h3 class="text-lg font-semibold tracking-tight text-slate-900">
              {{ t('generator.controlsTitle') }}
            </h3>
            <p class="mt-1 text-sm text-slate-500">
              {{ t(`pages.${pageKey}.generatorControls`) }}
            </p>
          </div>

          <ControlPanel />
          <ExportSection />
        </div>
      </div>
    </div>
  </section>
</template>
