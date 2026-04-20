<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const { isAuthed, user, restore, login, register, logout, keys, fetchKeys, createKey } = useAuth()

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const pending = ref(false)
const errorText = ref<string | null>(null)

const newKey = ref<string | null>(null)

onMounted(() => {
  restore()
})

const title = computed(() => (isAuthed.value ? '账户与 API Key' : mode.value === 'login' ? '登录' : '注册'))

const close = () => emit('close')

const handleSubmit = async () => {
  errorText.value = null
  newKey.value = null
  pending.value = true
  try {
    if (mode.value === 'login') await login(email.value, password.value)
    else await register(email.value, password.value)
  } catch (e: any) {
    errorText.value = e?.data?.message || e?.message || '请求失败'
  } finally {
    pending.value = false
  }
}

const handleGenerateKey = async () => {
  errorText.value = null
  newKey.value = null
  pending.value = true
  try {
    const res = await createKey()
    newKey.value = res.key
  } catch (e: any) {
    errorText.value = e?.data?.message || e?.message || '生成失败'
  } finally {
    pending.value = false
  }
}

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    window.prompt('复制此内容：', text)
  }
}

const handleOpen = async () => {
  if (isAuthed.value) await fetchKeys()
}

watch(
  () => props.open,
  (v) => {
    if (v) handleOpen()
    else {
      errorText.value = null
      newKey.value = null
      password.value = ''
    }
  }
)
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-[100]">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1e] shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div class="text-base font-semibold">{{ title }}</div>
          <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" @click="close" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6">
          <template v-if="!isAuthed">
            <div class="flex gap-2 mb-6">
              <button
                class="flex-1 py-2 rounded-xl text-sm font-medium border transition-colors"
                :class="mode === 'login' ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white' : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
                @click="mode = 'login'"
              >
                登录
              </button>
              <button
                class="flex-1 py-2 rounded-xl text-sm font-medium border transition-colors"
                :class="mode === 'register' ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white' : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
                @click="mode = 'register'"
              >
                注册
              </button>
            </div>

            <form class="space-y-4" @submit.prevent="handleSubmit">
              <div class="space-y-2">
                <label class="text-xs text-gray-500">邮箱</label>
                <input v-model="email" type="email" class="w-full rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40" />
              </div>
              <div class="space-y-2">
                <label class="text-xs text-gray-500">密码</label>
                <input v-model="password" type="password" class="w-full rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40" />
                <div class="text-[11px] text-gray-500">至少 8 位</div>
              </div>

              <div v-if="errorText" class="text-sm text-red-600 dark:text-red-400">{{ errorText }}</div>

              <button
                class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                :disabled="pending"
                type="submit"
              >
                {{ pending ? '处理中…' : mode === 'login' ? '登录' : '注册并登录' }}
              </button>
            </form>
          </template>

          <template v-else>
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user?.email }}</div>
                <div class="text-xs text-gray-500 mt-1">使用 API Key 让 Agent 通过 Skill 调用 LogoWear 的图标生成接口</div>
              </div>
              <button class="text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" @click="logout">
                退出登录
              </button>
            </div>

            <div class="mt-6 space-y-4">
              <button
                class="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                :disabled="pending"
                @click="handleGenerateKey"
              >
                {{ pending ? '生成中…' : '生成新的 API Key' }}
              </button>

              <div v-if="newKey" class="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 p-4">
                <div class="text-xs font-semibold text-amber-800 dark:text-amber-200">仅显示一次，请立即保存</div>
                <div class="mt-2 flex items-center gap-2">
                  <div class="flex-1 font-mono text-xs break-all text-amber-900 dark:text-amber-100">{{ newKey }}</div>
                  <button class="px-3 py-2 rounded-lg bg-amber-800 text-white text-xs font-medium hover:bg-amber-900 transition-colors" @click="handleCopy(newKey)">
                    复制
                  </button>
                </div>
              </div>

              <div v-if="errorText" class="text-sm text-red-600 dark:text-red-400">{{ errorText }}</div>

              <div class="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="px-4 py-3 bg-gray-50 dark:bg-black/20 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  已创建的 Key（仅展示末 4 位）
                </div>
                <div v-if="keys.length" class="divide-y divide-gray-200 dark:divide-gray-800">
                  <div v-for="k in keys" :key="k.id" class="px-4 py-3 flex items-center justify-between">
                    <div class="text-sm font-mono">•••• {{ k.last4 }}</div>
                    <div class="text-xs text-gray-500">{{ new Date(k.createdAt).toLocaleString() }}</div>
                  </div>
                </div>
                <div v-else class="px-4 py-4 text-sm text-gray-500">暂无 Key</div>
              </div>

              <div class="text-xs text-gray-500 leading-relaxed">
                Skill 接口：POST /api/skills/icon-pack（Header：x-api-key）
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
