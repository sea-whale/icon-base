import { createError, readBody } from 'h3'
import { readDb, writeDb } from '../../utils/db'
import { createSession } from '../../utils/auth'
import { randomId } from '../../utils/crypto'
import { hashPassword } from '../../utils/password'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = (body.email || '').trim().toLowerCase()
  const password = body.password || ''

  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' })
  }

  const db = await readDb()
  if (db.users.some((u) => u.email === email)) {
    throw createError({ statusCode: 409, statusMessage: 'Email already exists' })
  }

  const user = {
    id: randomId(),
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    apiKeys: []
  }

  db.users.push(user)
  await writeDb(db)

  const token = await createSession(user.id)
  return { token, user: { id: user.id, email: user.email } }
})

