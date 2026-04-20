import { PNG } from 'pngjs'

const base = 'http://localhost:3000'

const makePngDataUrl = () => {
  const png = new PNG({ width: 8, height: 8 })
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const i = (png.width * y + x) << 2
      png.data[i] = 255
      png.data[i + 1] = 255
      png.data[i + 2] = 255
      png.data[i + 3] = x < 4 && y < 4 ? 0 : 255
    }
  }
  const buf = PNG.sync.write(png)
  return `data:image/png;base64,${buf.toString('base64')}`
}

const testImgUrl = makePngDataUrl()

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
