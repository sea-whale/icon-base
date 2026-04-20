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
  "backgroundColor": "#000000",
  "padding": 20,
  "borderRadius": 22.5,
  "responseType": "json"
}
```

字段说明：
- `imageDataUrl`：必填，Data URL（Base64）。服务端模式暂不支持 SVG。
- `backgroundColor`：背景色（#RRGGBB）
- `padding`：0-50（百分比），越大代表图标离边缘越远
- `borderRadius`：0-50（百分比），Apple 风格建议 22.5
- `responseType`：
  - `json`：返回 Base64 ZIP（默认）
  - `binary`：直接返回二进制 ZIP（便于浏览器下载）

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

