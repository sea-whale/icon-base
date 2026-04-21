<script setup lang="ts">
import { computed } from 'vue'
import { useHead, useI18n, useLocalePath, useRoute, useSeoMeta } from '#imports'
import { ArrowRight } from 'lucide-vue-next'
import GeneratorWorkspace from './GeneratorWorkspace.vue'
import HeroTransformationShowcase from './HeroTransformationShowcase.vue'
import {
  PAGE_DEFINITIONS,
  PAGE_ORDER,
  SITE_IMAGE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  type SeoPageKey
} from '../utils/site'

interface LocalizedContentItem {
  title: string
  description: string
}

interface FaqItem {
  question: string
  answer: string
}

const props = defineProps<{
  pageKey: SeoPageKey
}>()

const { t, tm, rt, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const pageKey = computed(() => props.pageKey)
const seoBase = computed(() => `pages.${pageKey.value}.seo`)
const pageBase = computed(() => `pages.${pageKey.value}`)

const features = computed(() => {
  const items = tm(`${pageBase.value}.features`) as Array<Record<string, unknown>>
  return items.map((item) => ({
    title: rt(item.title),
    description: rt(item.description)
  })) as LocalizedContentItem[]
})

const steps = computed(() => {
  const items = tm(`${pageBase.value}.steps`) as Array<Record<string, unknown>>
  return items.map((item) => ({
    title: rt(item.title),
    description: rt(item.description)
  })) as LocalizedContentItem[]
})

const faqs = computed(() => {
  const items = tm(`${pageBase.value}.faq`) as Array<Record<string, unknown>>
  return items.map((item) => ({
    question: rt(item.question),
    answer: rt(item.answer)
  })) as FaqItem[]
})
const relatedPages = computed(() => PAGE_DEFINITIONS[pageKey.value].related.map((key) => ({
  key,
  path: localePath(PAGE_DEFINITIONS[key].path)
})))

const title = computed(() => t(`${seoBase.value}.title`))
const description = computed(() => t(`${seoBase.value}.description`))
const keywords = computed(() => t(`${seoBase.value}.keywords`))
const ogTitle = computed(() => t(`${seoBase.value}.ogTitle`))
const ogDescription = computed(() => t(`${seoBase.value}.ogDescription`))
const twitterTitle = computed(() => t(`${seoBase.value}.twitterTitle`))
const twitterDescription = computed(() => t(`${seoBase.value}.twitterDescription`))
const canonicalUrl = computed(() => absoluteUrl(route.path))

useSeoMeta({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage: SITE_IMAGE,
  ogUrl: canonicalUrl,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage: SITE_IMAGE
})

const schemaGraph = computed(() => {
  const websiteSchema = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: locale.value,
    description: description.value
  }

  const softwareSchema = {
    '@type': 'SoftwareApplication',
    name: title.value,
    applicationCategory: PAGE_DEFINITIONS[pageKey.value].softwareCategory,
    operatingSystem: 'Web',
    url: canonicalUrl.value,
    image: SITE_IMAGE,
    description: description.value,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  }

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.value.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, softwareSchema, faqSchema]
  }
})

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      key: `schema-${pageKey.value}`,
      children: JSON.stringify(schemaGraph.value)
    }
  ]
}))
</script>

<template>
  <div>
    <section class="relative pt-14 sm:pt-20 pb-14">
      <div class="max-w-7xl mx-auto px-5 sm:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="mt-4 text-[40px] leading-[1.05] sm:text-[56px] font-extrabold tracking-tight text-slate-950">
            {{ t(`${pageBase}.hero.title`) }}
          </h1>
          <p class="mt-5 max-w-3xl mx-auto text-lg leading-8 text-slate-600">
            {{ t(`${pageBase}.hero.intro`) }}
          </p>

          <HeroTransformationShowcase :background-id="PAGE_DEFINITIONS[pageKey].defaultBackgroundId" />

          <div class="mt-8 flex justify-center">
            <a href="#generator"
              class="h-12 px-8 rounded-full bg-[#536350] text-[#ecfee5] hover:bg-[#475744] transition-colors text-[15px] font-semibold inline-flex items-center gap-2 shadow-[0_12px_40px_rgba(45,52,48,0.08)]">
              <span>{{ t(`${pageBase}.hero.cta`) }}</span>
              <ArrowRight :size="18" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <GeneratorWorkspace :page-key="pageKey" :default-background-id="PAGE_DEFINITIONS[pageKey].defaultBackgroundId" />

    <section class="py-8 lg:py-12">
      <div class="max-w-7xl mx-auto px-5 sm:px-8 grid gap-6 lg:grid-cols-3">
        <article v-for="item in features" :key="item.title"
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(45,52,48,0.04)]">
          <h2 class="text-xl font-semibold tracking-tight text-slate-900">{{ item.title }}</h2>
          <p class="mt-3 text-sm leading-7 text-slate-600">{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="py-8 lg:py-12">
      <div class="max-w-7xl mx-auto px-5 sm:px-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="rounded-3xl bg-[#111827] text-white p-8">
          <h2 class="text-2xl font-bold tracking-tight">{{ t(`${pageBase}.stepsTitle`) }}</h2>
          <div class="mt-6 space-y-4">
            <div v-for="(step, index) in steps" :key="step.title"
              class="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div class="text-sm font-semibold text-emerald-300">{{ index + 1 }}. {{ step.title }}</div>
              <p class="mt-2 text-sm leading-7 text-slate-200">{{ step.description }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-8">
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">{{ t(`${pageBase}.faqTitle`) }}</h2>
          <div class="mt-6 space-y-4">
            <div v-for="item in faqs" :key="item.question" class="rounded-2xl bg-slate-50 p-5">
              <h3 class="text-base font-semibold text-slate-900">{{ item.question }}</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>
