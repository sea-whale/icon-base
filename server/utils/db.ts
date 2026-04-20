import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export interface ApiKeyRecord {
  id: string
  keyHash: string
  last4: string
  createdAt: string
}

export interface UserRecord {
  id: string
  email: string
  passwordHash: string
  createdAt: string
  apiKeys: ApiKeyRecord[]
}

export interface SessionRecord {
  tokenHash: string
  userId: string
  createdAt: string
  expiresAt: string
}

export interface DbSchema {
  users: UserRecord[]
  sessions: SessionRecord[]
}

const dbFilePath = () => join(process.cwd(), '.data', 'logowear-db.json')

const ensureDbFile = async () => {
  const filePath = dbFilePath()
  await mkdir(dirname(filePath), { recursive: true })
  try {
    await readFile(filePath, 'utf8')
  } catch {
    const initial: DbSchema = { users: [], sessions: [] }
    await writeFile(filePath, JSON.stringify(initial, null, 2), 'utf8')
  }
}

export const readDb = async (): Promise<DbSchema> => {
  await ensureDbFile()
  const raw = await readFile(dbFilePath(), 'utf8')
  return JSON.parse(raw) as DbSchema
}

export const writeDb = async (db: DbSchema) => {
  await ensureDbFile()
  await writeFile(dbFilePath(), JSON.stringify(db, null, 2), 'utf8')
}

