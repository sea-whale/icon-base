import { createError, readBody } from 'h3'
import { readDb } from '../../utils/db'
import { verifyPassword } from '../../utils/password'
import { createSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = (body.email || '').trim().toLowerCase()
  const password = body.password || ''

  const db = await readDb()
  const user = db.users.find((u) => u.email === email)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  if (!verifyPassword(password, user.passwordHash)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const token = await createSession(user.id)
  return { token, user: { id: user.id, email: user.email } }
})

