<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig, useI18n, useLocalePath, useSwitchLocalePath } from '#imports'
import { Github, Languages } from 'lucide-vue-next'
import { PAGE_ORDER, PAGE_DEFINITIONS, type SeoPageKey } from '../utils/site'

const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const appConfig = useAppConfig()

const pageKeys = (PAGE_ORDER.filter(key => key !== 'home')) as SeoPageKey[]
const localeOptions = computed(() => locales.value.map((item: any) => ({
  code: item.code,
  name: item.name || item.code.toUpperCase(),
  path: switchLocalePath(item.code)
})))
</script>

<template>
  <header class="relative z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
    <div class="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink :to="localePath('/')" class="flex items-center gap-3">
          <img src="/logo.png" alt="IconBase" class="w-9 h-9 rounded-lg shadow-sm object-cover" />
          <div>
            <div class="text-[15px] font-semibold tracking-tight">{{ t('app.title') }}</div>
            <div class="text-xs text-slate-500">{{ t('app.subtitle') }}</div>
          </div>
        </NuxtLink>

        <a v-if="appConfig.links.github" :href="appConfig.links.github" target="_blank" rel="noreferrer"
          class="lg:hidden h-9 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 text-slate-600">
          <Github :size="16" />
        </a>
      </div>

      <div class="flex flex-col gap-3 lg:items-end">


        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
            <Languages :size="14" />
            {{ t('navigation.language') }}
          </span>

          <NuxtLink v-for="item in localeOptions" :key="item.code" :to="item.path"
            class="px-2.5 py-1.5 rounded-full border text-xs font-semibold transition-colors"
            :class="item.code === locale ? 'border-[#536350] bg-[#536350] text-[#ecfee5]' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'">
            {{ item.name }}
          </NuxtLink>

          <a v-if="appConfig.links.github" :href="appConfig.links.github" target="_blank" rel="noreferrer"
            class="hidden lg:inline-flex h-9 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors items-center gap-1.5 text-slate-600">
            <Github :size="16" />
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
