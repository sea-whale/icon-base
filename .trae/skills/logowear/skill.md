# LogoWear Skill：生成全尺寸图标包

## 1. 目的
通过 LogoWear 提供的 HTTP 接口，把一张源图（Data URL Base64）一键生成全尺寸合规图标，并返回 ZIP（Base64）。

该 Skill 适用于 Agent 在工作流中自动化生成：
- favicon（16/32）
- apple-touch-icon（180）
- Android chrome（192/512）
- 桌面端图标（256/1024）
- maskable 图标（512）

## 2. 前置条件：注册、登录、获取 API Key

### 2.1 方式 A（推荐）：在网页里获取
1. 打开 LogoWear（本地默认 http://localhost:3000/）
2. 右上角点击“登录 / 注册”
3. 登录后在弹窗里点击“生成新的 API Key”
4. API Key 只会显示一次，请立即保存

### 2.2 方式 B：用接口获取（用于自动化）
- 注册：`POST /api/auth/register`
- 登录：`POST /api/auth/login`
- 创建 Key：`POST /api/keys`（Header: `Authorization: Bearer <token>`）

## 3. Skill 调用接口（Agent 使用）

### 3.1 请求
`POST http://localhost:3000/api/skills/icon-pack`

**Headers**
- `x-api-key: <你的 API Key>`
- `content-type: application/json`

**Body（JSON）**
```json
{
  "imageDataUrl": "data:image/png;base64,...",
  "backgroundId": "apple-dark",
  "padding": 20,
  "borderRadius": 22.5,
  "responseType": "json"
}
```

字段说明：
- `imageDataUrl` (string): 必须，包含图像数据的 Base64 URI（支持 PNG, JPEG, WEBP，服务端暂不支持 SVG）
- `backgroundId` (string): 可选，底色模板 ID，默认 `apple-dark`。支持：`apple-dark`, `apple-light`, `solid-black`, `solid-white`, `solid-graphite`, `solid-cream`, `grad-sunset`, `grad-ocean`, `grad-purple`, `grad-midnight`, `grad-lime`, `grad-peach`, `pattern-dots`, `pattern-grid`, `glow-blue`, `glow-purple`, `stripes-slate`, `spotlight-rose`, `spotlight-sky`, `accent-corner`, `accent-diagonal`, `confetti-mono`
- 可用模板列表接口：`GET http://localhost:3000/api/backgrounds`
- `padding` (number): 可选，图标缩放间距百分比 (0-50)，默认 `20`
- `borderRadius` (number): 可选，图标圆角曲率百分比 (0-50)，默认 `22.5`
- `responseType` (string): 可选，`"json"` 或 `"binary"`。`"json"` 返回 base64，`"binary"` 直接返回 ZIP 二进制

### 3.2 响应（JSON 模式）
```json
{
  "filename": "logowear-icons.zip",
  "mime": "application/zip",
  "base64": "UEsDBBQAAAAI..."
}
```

## 4. 安全建议
- API Key 视作密码，不要写入仓库或日志。
- 建议为不同 Agent / 不同工作流创建不同的 API Key，便于轮换。
