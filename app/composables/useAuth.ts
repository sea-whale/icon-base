import { computed } from 'vue'

export interface AuthUser {
  id: string
  email: string
}

export interface ApiKeyInfo {
  id: string
  last4: string
  createdAt: string
}

const STORAGE_TOKEN = 'logowear.sessionToken'
const STORAGE_USER = 'logowear.user'

export const useAuth = () => {
  const token = useState<string | null>('auth.token', () => null)
  const user = useState<AuthUser | null>('auth.user', () => null)
  const keys = useState<ApiKeyInfo[]>('auth.keys', () => [])

  const isAuthed = computed(() => !!token.value && !!user.value)

  const persist = () => {
    if (!process.client) return
    if (token.value) localStorage.setItem(STORAGE_TOKEN, token.value)
    else localStorage.removeItem(STORAGE_TOKEN)
    if (user.value) localStorage.setItem(STORAGE_USER, JSON.stringify(user.value))
    else localStorage.removeItem(STORAGE_USER)
  }

  const restore = () => {
    if (!process.client) return
    const t = localStorage.getItem(STORAGE_TOKEN)
    const u = localStorage.getItem(STORAGE_USER)
    token.value = t || null
    user.value = u ? (JSON.parse(u) as AuthUser) : null
  }

  const authHeaders = () => (token.value ? { Authorization: `Bearer ${token.value}` } : {})

  const register = async (email: string, password: string) => {
    const res = await $fetch<{ token: string; user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: { email, password }
    })
    token.value = res.token
    user.value = res.user
    persist()
    await fetchKeys()
  }

  const login = async (email: string, password: string) => {
    const res = await $fetch<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    token.value = res.token
    user.value = res.user
    persist()
    await fetchKeys()
  }

  const logout = async () => {
    token.value = null
    user.value = null
    keys.value = []
    persist()
  }

  const fetchKeys = async () => {
    if (!token.value) return
    const res = await $fetch<{ keys: ApiKeyInfo[] }>('/api/keys', {
      method: 'GET',
      headers: authHeaders()
    })
    keys.value = res.keys
  }

  const createKey = async () => {
    if (!token.value) throw new Error('Not authenticated')
    const res = await $fetch<{ key: string; id: string; last4: string; createdAt: string }>('/api/keys', {
      method: 'POST',
      headers: authHeaders()
    })
    await fetchKeys()
    return res
  }

  return {
    token,
    user,
    keys,
    isAuthed,
    restore,
    register,
    login,
    logout,
    fetchKeys,
    createKey
  }
}

