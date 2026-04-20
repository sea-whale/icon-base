import { requireUserId, createApiKey } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const key = await createApiKey(userId)
  return key
})

