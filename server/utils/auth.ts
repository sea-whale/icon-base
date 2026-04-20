import { createError, getHeader } from 'h3'
import { readDb, writeDb } from './db'
import { randomId, randomToken, sha256Hex } from './crypto'

const SESSION_DAYS = 30

export const createSession = async (userId: string) => {
  const token = randomToken(32)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  const record = {
    tokenHash: sha256Hex(token),
    userId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  }

  const db = await readDb()
  db.sessions = db.sessions.filter((s) => new Date(s.expiresAt).getTime() > Date.now())
  db.sessions.push(record)
  await writeDb(db)

  return token
}

export const getUserIdFromAuthHeader = async (authorization?: string | null) => {
  if (!authorization) return null
  const [type, token] = authorization.split(' ')
  if (type !== 'Bearer' || !token) return null

  const db = await readDb()
  const tokenHash = sha256Hex(token)
  const session = db.sessions.find((s) => s.tokenHash === tokenHash)
  if (!session) return null
  if (new Date(session.expiresAt).getTime() <= Date.now()) return null
  return session.userId
}

export const requireUserId = async (event: any) => {
  const userId = await getUserIdFromAuthHeader(getHeader(event, 'authorization'))
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return userId
}

export const createApiKey = async (userId: string) => {
  const key = `lw_${randomToken(32)}`
  const keyHash = sha256Hex(key)
  const last4 = key.slice(-4)
  const now = new Date().toISOString()
  const id = randomId()

  const db = await readDb()
  const user = db.users.find((u) => u.id === userId)
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  user.apiKeys.push({ id, keyHash, last4, createdAt: now })
  await writeDb(db)

  return { key, id, last4, createdAt: now }
}

export const requireUserIdFromApiKey = async (event: any) => {
  const apiKey = getHeader(event, 'x-api-key')
  if (!apiKey) throw createError({ statusCode: 401, statusMessage: 'Missing API key' })
  const db = await readDb()
  const apiKeyHash = sha256Hex(apiKey)
  for (const user of db.users) {
    if (user.apiKeys.some((k) => k.keyHash === apiKeyHash)) return user.id
  }
  throw createError({ statusCode: 401, statusMessage: 'Invalid API key' })
}

