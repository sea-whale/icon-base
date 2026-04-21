<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'
import type { IconShapeMode } from '../utils/iconGenerator'

const uploadedImage = inject<Ref<string | null>>('uploadedImage', ref(null))
const backgroundId = inject<Ref<string>>('backgroundId', ref('apple-dark'))
const padding = inject<Ref<number>>('padding', ref(20))
const borderRadius = inject<Ref<number>>('borderRadius', ref(22.5))
const shapeMode = inject<Ref<IconShapeMode>>('shapeMode', ref('rounded-rect'))

const generatedIcon = ref<string>('')
const dockIcons = ref<Record<string, string>>({})

const dockPresets = [
  { id: 'layers', imageUrl: '/svgs/layers.svg', backgroundId: 'mesh-holo', padding: 22 },
  { id: 'airplay', imageUrl: '/svgs/airplay.svg', backgroundId: 'apple-light', padding: 22 },
  { id: 'compass', imageUrl: '/svgs/compass.svg', backgroundId: 'grad-peach', padding: 20 },
  { id: 'mail', imageUrl: '/svgs/mail.svg', backgroundId: 'glass-green-glow', padding: 20 },
  { id: 'calendar', imageUrl: '/svgs/calendar.svg', backgroundId: 'solid-cream', padding: 18 }
] as const

const renderDockPresets = async () => {
  if (!import.meta.client) return

  try {
    const { generateIconDataUrl } = await import('../utils/iconGenerator')
    const results = await Promise.all(
      dockPresets.map(async (preset) => {
        const src = await generateIconDataUrl({
          imageUrl: preset.imageUrl,
          backgroundId: preset.backgroundId,
          padding: preset.padding,
          borderRadius: 22.5,
          shapeMode: 'apple-official',
          size: 256,
          transparentBg: false
        })

        return [preset.id, src] as const
      })
    )

    dockIcons.value = Object.fromEntries(results)
  } catch (e) {
    console.error(e)
  }
}

const updateGeneratedIcon = async () => {
  if (!import.meta.client) return
  if (!uploadedImage?.value || !backgroundId || !padding || !borderRadius) return

  try {
    const { generateIconDataUrl } = await import('../utils/iconGenerator')
    generatedIcon.value = await generateIconDataUrl({
      imageUrl: uploadedImage.value,
      backgroundId: backgroundId.value,
      padding: padding.value,
      borderRadius: borderRadius.value,
      shapeMode: shapeMode.value,
      size: 256,
      transparentBg: false
    })
  } catch (e) {
    console.error(e)
  }
}

renderDockPresets()
watch([uploadedImage, backgroundId, padding, borderRadius, shapeMode], updateGeneratedIcon, { immediate: true })
</script>

<template>
  <div
    class="relative h-44 overflow-hidden rounded-[24px] border border-[#d9d6cf] shadow-[0_18px_45px_rgba(45,52,48,0.10)] transition-colors">
    <div class="absolute inset-0 bg-[url('/bg/mac.jpeg')] bg-cover bg-center scale-[1.02]"></div>
    <div
      class="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,251,255,0.10),rgba(8,12,22,0.06)_42%,rgba(8,12,22,0.24))]">
    </div>
    <div
      class="absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.24),rgba(255,255,255,0)_70%)] opacity-80">
    </div>
    <div class="absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))]">
    </div>

    <div class="relative z-10 flex h-full items-end justify-center px-4 pb-4">
      <div class="absolute bottom-[18px] h-4 w-[78%] rounded-full bg-black/20 blur-xl"></div>

      <div
        class="relative flex items-end gap-2 rounded-[28px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0.16))] px-3 py-2.5 shadow-[0_20px_45px_rgba(9,16,32,0.24)] backdrop-blur-[22px]">

        <div v-for="iconId in ['layers', 'airplay', 'compass', 'mail']" :key="iconId"
          class="group relative flex flex-col items-center">
          <div class="relative h-11 w-11">
            <img v-if="dockIcons[iconId]" :src="dockIcons[iconId]"
              class="h-full w-full object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.20)]" />
            <div v-else class="h-full w-full animate-pulse rounded-[14px] bg-white/25"></div>
          </div>
          <div class="mt-1.5 h-1 w-1 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
        </div>

        <div
          class="mx-0.5 h-10 w-px self-center bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.58),rgba(255,255,255,0))]">
        </div>

        <div class="group relative flex flex-col items-center">
          <div
            class="absolute -top-10 left-1/2 -translate-x-1/2 rounded-xl bg-slate-950/78 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-[0_10px_20px_rgba(0,0,0,0.28)] backdrop-blur-md transition-opacity whitespace-nowrap pointer-events-none group-hover:opacity-100">
            App
            <div class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-950/78"></div>
          </div>
          <div class="relative transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-[1.08]">
            <div class="absolute inset-x-2 -bottom-3 h-3 rounded-full bg-black/20 blur-md"></div>
            <div class="relative h-11 w-11 shrink-0">
              <img v-if="generatedIcon" :src="generatedIcon"
                class="h-full w-full object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.22)]" />
              <div v-else class="h-full w-full animate-pulse rounded-[14px] bg-white/25"></div>
            </div>
          </div>
          <div class="mt-1.5 h-1 w-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]"></div>
        </div>

        <div class="group relative flex flex-col items-center">
          <div class="relative h-11 w-11">
            <img v-if="dockIcons.calendar" :src="dockIcons.calendar"
              class="h-full w-full object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.16)]" />
            <div v-else class="h-full w-full animate-pulse rounded-[14px] bg-white/25"></div>
          </div>
          <div class="mt-1.5 h-1 w-1 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
        </div>
      </div>
    </div>
  </div>
</template>
