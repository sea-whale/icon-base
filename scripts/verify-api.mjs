const base = 'http://localhost:3000'

const testImgUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQIW2NkYGD4z8DAwMgAI0AMDA4YAQEB2zQ/AAAAAElFTkSuQmCC'

const email = `test_${Date.now()}@example.com`
const password = 'password123'

const postJson = async (url, body, headers = {}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body)
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${JSON.stringify(json)}`)
  return json
}

const main = async () => {
  const reg = await postJson(`${base}/api/auth/register`, { email, password })
  const token = reg.token

  const key = await postJson(`${base}/api/keys`, {}, { Authorization: `Bearer ${token}` })

  const pack = await postJson(
    `${base}/api/skills/icon-pack`,
    { imageDataUrl: testImgUrl, backgroundId: 'grad-ocean', padding: 20, borderRadius: 22.5, responseType: 'json' },
    { 'x-api-key': key.key }
  )

  console.log(
    JSON.stringify(
      { ok: true, email, tokenPrefix: token.slice(0, 10), apiKeyPrefix: key.key.slice(0, 10), zipB64Len: pack.base64.length },
      null,
      2
    )
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
