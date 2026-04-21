<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'
import { Settings, MessageSquare, Compass, Mail, Calendar, Map, Phone } from 'lucide-vue-next'

const uploadedImage = inject<Ref<string | null>>('uploadedImage', ref(null))
const backgroundId = inject<Ref<string>>('backgroundId', ref('apple-dark'))
const padding = inject<Ref<number>>('padding', ref(20))
const borderRadius = inject<Ref<number>>('borderRadius', ref(22.5))

const generatedIcon = ref<string>('')

const updateIcon = async () => {
  if (!import.meta.client) return
  if (!uploadedImage?.value || !backgroundId || !padding || !borderRadius) return

  try {
    const { generateIconDataUrl } = await import('../utils/iconGenerator')
    generatedIcon.value = await generateIconDataUrl({
      imageUrl: uploadedImage.value,
      backgroundId: backgroundId.value,
      padding: padding.value,
      borderRadius: borderRadius.value,
      size: 256,
      transparentBg: false
    })
  } catch (e) {
    console.error(e)
  }
}

watch([uploadedImage, backgroundId, padding, borderRadius], updateIcon, { immediate: true })
</script>

<template>
  <div
    class="h-36 rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(45,52,48,0.06)] border border-[#e4e2de] transition-colors relative flex flex-col justify-end bg-[url('/bg/mac.jpeg')] bg-cover bg-center">
    <div class="absolute inset-0 bg-black/10"></div>

    <div class="w-full flex justify-center pb-2 relative z-10">
      <!-- Dock Container -->
      <div
        class="relative z-10 mb-3 px-3 py-1.5 self-center bg-white/20 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center gap-2 shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
        <!-- Dock Items -->
        <div
          class="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-300 rounded-xl shadow-sm flex items-center justify-center shrink-0">
          <Settings :size="20" class="text-slate-600" />
        </div>
        <div
          class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-sm flex items-center justify-center shrink-0">
          <MessageSquare :size="20" class="text-white" />
        </div>
        <div
          class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-sm flex items-center justify-center shrink-0 relative overflow-hidden">
          <Compass :size="22" class="text-white" />
        </div>
        <div
          class="w-10 h-10 bg-gradient-to-br from-sky-300 to-sky-500 rounded-xl shadow-sm flex items-center justify-center shrink-0">
          <Mail :size="20" class="text-white" />
        </div>

        <!-- Generated Icon -->
        <div class="relative group">
          <div
            class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium shadow-md">
            App
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/80 rotate-45"></div>
          </div>
          <div
            class="w-10 h-10 shrink-0 transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-110">
            <img v-if="generatedIcon" :src="generatedIcon"
              class="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]" />
            <div v-else class="w-full h-full bg-white/20 animate-pulse rounded-xl"></div>
          </div>
        </div>

        <div
          class="w-10 h-10 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center shrink-0 border border-slate-200">
          <span class="text-[7px] font-extrabold text-red-500 tracking-wider">JUL</span>
          <span class="text-base font-light leading-none mt-px text-slate-900">17</span>
        </div>
      </div>
    </div>
  </div>
</template>
