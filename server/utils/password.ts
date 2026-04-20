import crypto from 'node:crypto'

const ITERATIONS = 120_000
const KEYLEN = 32
const DIGEST = 'sha256'

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('base64url')
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('base64url')
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`
}

export const verifyPassword = (password: string, stored: string) => {
  const parts = stored.split('$')
  if (parts.length !== 4) return false
  const [, iterStr, salt, expectedHash] = parts
  const iterations = Number(iterStr)
  if (!Number.isFinite(iterations) || iterations <= 0) return false
  const computed = crypto.pbkdf2Sync(password, salt, iterations, KEYLEN, DIGEST).toString('base64url')
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(expectedHash))
}

