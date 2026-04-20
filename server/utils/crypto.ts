import crypto from 'node:crypto'

export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('base64url')

export const randomId = () => crypto.randomUUID()

export const sha256Hex = (input: string) => crypto.createHash('sha256').update(input).digest('hex')

