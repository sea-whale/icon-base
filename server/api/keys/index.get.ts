import { readDb } from '../../utils/db'
import { requireUserId } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const db = await readDb()
  const user = db.users.find((u) => u.id === userId)
  if (!user) return { keys: [] }
  return {
    keys: user.apiKeys.map((k) => ({ id: k.id, last4: k.last4, createdAt: k.createdAt }))
  }
})

