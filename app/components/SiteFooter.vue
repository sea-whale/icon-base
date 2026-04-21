<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig, useI18n, useLocalePath } from '#imports'
import { Github } from 'lucide-vue-next'
import { PAGE_ORDER, PAGE_DEFINITIONS, type SeoPageKey } from '../utils/site'

defineProps<{
  domain: string
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const appConfig = useAppConfig()
const pageKeys = PAGE_ORDER as SeoPageKey[]
const year = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="relative z-10 border-t border-slate-200 bg-white">
    <div class="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div class="space-y-2">
        <div class="text-base font-semibold text-slate-900">{{ t('footer.title') }}</div>
        <p class="text-sm text-slate-600 max-w-xl">{{ t('footer.subtitle') }}</p>
        <p class="text-xs text-slate-500">{{ domain }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <div class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{{ t('footer.navigation') }}</div>
          <div class="flex flex-col gap-2">
            <NuxtLink
              v-for="pageKey in pageKeys"
              :key="pageKey"
              :to="localePath(PAGE_DEFINITIONS[pageKey].path)"
              class="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {{ t(`navigation.items.${PAGE_DEFINITIONS[pageKey].navKey}`) }}
            </NuxtLink>
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{{ t('footer.follow') }}</div>
          <div class="flex items-center gap-4">
            <a
              v-if="appConfig.links.x"
              :href="appConfig.links.x"
              target="_blank"
              rel="noreferrer"
              class="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {{ t('footer.x') }}
            </a>
            <a
              v-if="appConfig.links.github"
              :href="appConfig.links.github"
              target="_blank"
              rel="noreferrer"
              class="text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center"
            >
              <Github :size="18" />
            </a>
            <a
              v-if="appConfig.links.blog"
              :href="appConfig.links.blog"
              target="_blank"
              rel="noreferrer"
              class="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {{ t('footer.blog') }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-4 text-sm text-slate-500">
        {{ t('footer.copyright', { year }) }}
      </div>
    </div>
  </footer>
</template>
