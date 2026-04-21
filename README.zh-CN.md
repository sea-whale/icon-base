# IconBase

![Nuxt](https://img.shields.io/badge/Nuxt-002E3B?style=flat-square&logo=nuxtdotjs&logoColor=#00DC82)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat-square&logo=vuedotjs&logoColor=4FC08D)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-AGPL--3.0-blue.svg?style=flat-square)

**IconBase** 是一个以隐私为先的单页 Web 应用，可以将你的 Logo 转化为适用于全平台的精美 Apple 风格（圆角矩形）图标。

基于 Vue 3 和 Nuxt 4 构建，它提供跨操作系统的实时“所见即所得”预览，并支持一键导出包含所有平台标准图标的压缩包。

[阅读英文版 (English)](./README.md)

## ✨ 核心特性

- **跨平台实时预览**：立刻预览图标在以下环境中的真实效果：
  - macOS Dock
  - Windows 11 任务栏
  - iOS 与 Android 主屏幕
  - 浏览器标签页 (Favicon)
- **40+ 款精美背景模板**：内置纯色、渐变色、极光网格、毛玻璃、噪点纹理以及点缀光晕等多种风格的背景模板。
- **高自由度定制**：通过直观的滑块微调图标的内部缩放间距和圆角曲率。
- **一键全平台导出**：自动生成并打包下载（`.zip`）：
  - 兼容旧版 Windows 的 `.ico` 文件
  - 适用于 iOS 的 Apple Touch Icon (`180x180`)
  - 适用于 Android / PWA 的标准尺寸 (`192x192`, `512x512`)
  - 浏览器高清标签页图标 (`16x16`, `32x32`)
  - 供浏览器自动识别的 `site.webmanifest`
- **100% 隐私安全**：完全基于 HTML5 Canvas 2D API 纯客户端渲染。图片仅在你的本地浏览器处理，绝不上传任何服务器。
- **国际化 (i18n)**：原生支持中文和英文双语。

## 🚀 技术栈

- **前端框架**: [Nuxt 4](https://nuxt.com/) / [Vue 3](https://vuejs.org/) (Composition API)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **图标组件**: [Lucide Vue](https://lucide.dev/)
- **图形引擎**: 纯 HTML5 Canvas 2D
- **文件打包**: JSZip & FileSaver.js

## 📦 安装与开发

确保你已安装 Node.js 20+ 和 `pnpm`。

```bash
# 1. 克隆代码库
git clone https://github.com/sea-whale/icon-base.git
cd icon-base

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm run dev
```

在浏览器中打开 `http://localhost:3000` 即可预览。

## 🐳 Docker 部署

项目包含了一个多阶段构建的 Dockerfile，以及用于自动构建镜像的 GitHub Actions 工作流。

### 使用预构建镜像 (GitHub Container Registry)

```bash
docker pull ghcr.io/sea-whale/icon-base:latest
docker run -d -p 3000:3000 ghcr.io/sea-whale/icon-base:latest
```

### 手动构建镜像

```bash
docker build -t icon-base .
docker run -d -p 3000:3000 icon-base
```

## 🤝 参与贡献

欢迎任何形式的贡献！随时提交 Pull Request 或发起 Issue 讨论。

## 📄 开源协议

本项目基于仓库中包含的 LICENSE 许可协议开源。

## Star History

<a href="https://www.star-history.com/?repos=sea-whale%2Ficon-base&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=sea-whale/icon-base&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=sea-whale/icon-base&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=sea-whale/icon-base&type=date&legend=top-left" />
 </picture>
</a>
