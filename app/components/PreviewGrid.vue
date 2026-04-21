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
    <section class="rounded-xl" aria-labelledby="preview-browser-title">
      <h4 id="preview-browser-title" class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {{ t('preview.browser') }}
      </h4>
      <PreviewBrowser />
    </section>

    <div class="grid grid-cols-1 gap-4">
      <section class="rounded-xl" aria-labelledby="preview-mac-title">
        <h4 id="preview-mac-title" class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          {{ t('preview.macDock') }}
        </h4>
        <PreviewMacDock />
      </section>
      <section class="rounded-xl" aria-labelledby="preview-win-title">
        <h4 id="preview-win-title" class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          {{ t('preview.winTaskbar') }}
        </h4>
        <PreviewWinTaskbar />
      </section>
    </div>

    <section class="rounded-xl" aria-labelledby="preview-mobile-title">
      <h4 id="preview-mobile-title" class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {{ t('preview.mobile') }}
      </h4>
      <PreviewMobile />
    </section>
  </div>
</template>
