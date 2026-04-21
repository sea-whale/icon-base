# IconBase

![Nuxt](https://img.shields.io/badge/Nuxt-002E3B?style=flat-square&logo=nuxtdotjs&logoColor=#00DC82)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat-square&logo=vuedotjs&logoColor=4FC08D)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-AGPL--3.0-blue.svg?style=flat-square)

**IconBase** is a privacy-first, one-page web application that transforms your logo into beautiful, Apple-style (squircle) icons for every platform.

Built with Vue 3 and Nuxt 4, it provides real-time WYSIWYG previews across various operating systems and lets you export a complete set of standard icon assets with a single click.

[Read this in Chinese (简体中文)](./README.zh-CN.md)

## ✨ Features

- **Real-Time OS Previews**: Instantly see how your icon looks in:
  - macOS Dock
  - Windows 11 Taskbar
  - iOS & Android Home Screens
  - Browser Tabs (Favicon)
- **40+ Background Templates**: Choose from solid colors, gradients, mesh/grid, glassmorphism, noise patterns, and glowing accents.
- **High Customizability**: Fine-tune your icon's padding and corner roundness (border radius) using intuitive sliders.
- **One-Click Universal Export**: Automatically generates and zips up:
  - `.ico` file for legacy Windows support
  - Apple Touch Icon (`180x180`)
  - Android & PWA standard sizes (`192x192`, `512x512`)
  - Browser favicons (`16x16`, `32x32`)
  - `site.webmanifest` for PWAs
- **100% Privacy Preserving**: Built entirely with the HTML5 Canvas 2D API. Your images never leave your browser—no server uploads, no data collection.
- **i18n Support**: Native support for English and Chinese.

## 🚀 Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) / [Vue 3](https://vuejs.org/) (Composition API)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide Vue](https://lucide.dev/)
- **Graphics Engine**: Pure HTML5 Canvas 2D
- **Packaging**: JSZip & FileSaver.js

## 📦 Setup & Development

Make sure you have Node.js 20+ and `pnpm` installed.

```bash
# 1. Clone the repository
git clone https://github.com/sea-whale/icon-base.git
cd icon-base

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm run dev
```

Open `http://localhost:3000` in your browser.

## 🐳 Docker Deployment

IconBase includes a multi-stage Dockerfile and a GitHub Actions workflow for automatic container builds.

### Run via pre-built image (from GitHub Container Registry)

```bash
docker pull ghcr.io/sea-whale/icon-base:latest
docker run -d -p 3000:3000 ghcr.io/sea-whale/icon-base:latest
```

### Build manually

```bash
docker build -t icon-base .
docker run -d -p 3000:3000 icon-base
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

## 📄 License

This project is licensed under the terms of the LICENSE file included in the repository.

## Star History

<a href="https://www.star-history.com/?repos=sea-whale%2Ficon-base&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=sea-whale/icon-base&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=sea-whale/icon-base&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=sea-whale/icon-base&type=date&legend=top-left" />
 </picture>
</a>
