# IconBase System Agents & Architecture Guide

This document provides a comprehensive overview of the IconBase project architecture, its core components, utility functions, and the overall system workflow. It serves as a guide for developers and AI agents to understand how the system operates and how its various parts interact.

## 1. Project Overview

IconBase is a pure frontend Web application built with Vue 3 and Nuxt. It allows users to generate Apple-style (squircle/rounded rectangle) app icons and preview them in real-time across various simulated platform environments (Browser Tabs, macOS Dock, Windows Taskbar, Mobile Home Screens).

Users can upload custom images, adjust background styles, padding, and border radius, and then export a standardized package of icon assets with a single click.

## 2. Tech Stack

* **Core Framework**: Vue 3 (Composition API), Nuxt 4 (Static Site Generation / Client-Side Rendering)
* **Styling & UI**: Tailwind CSS, `lucide-vue-next` (Icons)
* **Graphics Processing**: HTML5 Canvas 2D API (Pure client-side rendering)
* **Internationalization (i18n)**: `@nuxtjs/i18n` (Supports English and Chinese)
* **File Handling & Export**: `jszip` (ZIP packaging), `file-saver` (Triggering file downloads)

## 3. Directory Structure

The project follows a standard Nuxt directory structure, with the main logic centralized in the `app` directory:

```text
IconBase/
├── app/                      # Core application code
│   ├── app.vue               # Root component (Layout & Global State)
│   ├── components/           # UI Components
│   │   ├── ControlPanel.vue  # Main controls (Upload, Settings, Backgrounds)
│   │   ├── ExportSection.vue # Export breakdown and download trigger
│   │   ├── PreviewGrid.vue   # Container for all preview environments
│   │   ├── PreviewBrowser.vue# Browser tab preview simulation
│   │   ├── PreviewMacDock.vue# macOS Dock preview simulation
│   │   ├── PreviewMobile.vue # iOS & Android home screen preview simulation
│   │   └── PreviewWinTaskbar.vue # Windows taskbar preview simulation
│   └── utils/                # Core business logic and utilities
│       ├── backgrounds.ts    # Background template definitions and configurations
│       ├── iconGenerator.ts  # Core Canvas-based rendering engine
│       └── exportZip.ts      # ZIP packaging and file generation logic
├── locales/                  # i18n language files
│   ├── en.json               # English translations
│   └── zh.json               # Chinese translations
├── public/                   # Static assets (e.g., logo.png, favicon)
├── app.config.ts             # Global app configuration (e.g., external links)
├── nuxt.config.ts            # Nuxt framework configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── package.json              # Project dependencies and scripts
```

## 4. Core Components Analysis

### 4.1. `app.vue` (Root & State Manager)

Acts as the orchestrator of the application. It defines the global layout (One-Page Flow) and manages the central state using Vue's `provide/inject` API. It holds the state for the uploaded image, selected background, padding, and border radius, passing them down to child components.

### 4.2. `ControlPanel.vue` (The Generator UI)

The primary interaction hub for the user:

* Handles image uploads via Drag & Drop or click (using `FileReader` to convert images to Base64 Data URLs).
* Displays a grid of available background presets. It uses the `iconGenerator` in the background to render thumbnails for these presets dynamically.
* Provides range sliders for adjusting `padding` (icon scaling) and `borderRadius` (squircle curvature).

### 4.3. Preview Component Family (`Preview*.vue`)

These components (`PreviewBrowser`, `PreviewMacDock`, `PreviewMobile`, `PreviewWinTaskbar`) simulate real-world OS environments.

* They `inject` the global state from `app.vue`.
* They dynamically call `generateIconDataUrl` (from `iconGenerator.ts`) to render the icon specifically for their environment based on the user's current settings, achieving a "What You See Is What You Get" (WYSIWYG) experience.

### 4.4. `ExportSection.vue` (The Exporter)

Displays a detailed breakdown of the files included in the export package and triggers the `handleExport` function, which relies on `exportZip.ts` to bundle the assets.

## 5. Core Utilities & Logic Engines

### 5.1. `iconGenerator.ts` (The Rendering Engine)

This is the mathematical and graphical heart of IconBase. It exposes the `generateIconDataUrl` function, which performs all Canvas 2D operations entirely in the browser:

* **Squircle Clipping**: Uses `quadraticCurveTo` to draw smooth, Apple-like rounded rectangles based on the user-defined `borderRadius`, and uses `clip()` to constrain the drawing area.
* **Complex Background Rendering**: Parses the configuration from `backgrounds.ts` and draws intricate backgrounds. It supports:
  * *Basic*: Solid colors, Linear/Radial gradients.
  * *Geometric*: Dots, Grids, Stripes, Checkerboards.
  * *Advanced Effects*: Glassmorphism (simulated), Mesh gradients, Noise/Grain overlays, and Confetti patterns.
* **Image Compositing**: Calculates the internal drawing area based on the user's `padding` setting, scales the uploaded image while maintaining its aspect ratio, centers it, and draws it on top of the generated background.
* Outputs a standard Base64 Data URL (PNG).

### 5.2. `exportZip.ts` (Packaging & Distribution)

Handles the generation of standard app icon assets and ZIP file creation:

* **Multi-Resolution Generation**: Iterates through a predefined list of standard sizes (e.g., 16x16, 32x32, 180x180, 192x192, 512x512). It calls `iconGenerator` for each size to generate high-quality PNGs in memory.
* **Custom ICO Construction**: Extracts the binary pixel data from the 32x32 Canvas rendering and manually constructs a valid `.ico` file by writing the correct ICO Header and Directory entries. This ensures compatibility with legacy systems.
* **Manifest Generation**: Dynamically creates a `site.webmanifest` JSON file, extracting the primary theme color from the selected background configuration for PWA compatibility.
* **ZIP Archiving**: Utilizes `jszip` to bundle all generated PNGs, the ICO file, and the manifest into a single `.zip` archive, which is then served to the user via `file-saver`.

## 6. System Workflow & State Management

### 6.1. State Management Pattern

IconBase intentionally avoids heavy external state libraries (like Pinia). Instead, it relies on Vue 3's native Reactivity API (`ref`, `computed`) combined with Dependency Injection (`provide/inject`) in `app.vue` to maintain a unidirectional data flow.

* **Core Reactive State**:
  * `uploadedImage`: Base64 string of the user's logo.
  * `backgroundId`: String ID mapping to a preset in `backgrounds.ts`.
  * `padding`: Number (0-50) representing internal padding percentage.
  * `borderRadius`: Number (0-50) representing corner curvature percentage.

### 6.2. The User Journey (Data Flow)

1. **Initialization**: The app loads. `ControlPanel.vue` mounts and silently renders thumbnail previews for all background templates using empty/placeholder images.
2. **Input**: The user uploads an image. `ControlPanel` reads the file, updates the `uploadedImage` global state, and randomly selects an initial `backgroundId`.
3. **Adjustment & Real-time Preview**:
    * The user interacts with the `ControlPanel` (changes background, moves sliders).
    * The global injected state updates instantly.
    * All active `Preview*.vue` components detect the state change, re-run `generateIconDataUrl`, and update their respective simulated UI screens.
4. **Export**:
    * The user clicks the Export button in `ExportSection.vue`.
    * `exportZip.ts` takes the current global state (`uploadedImage`, `backgroundId`, `padding`, `borderRadius`).
    * It loops through necessary sizes, calling the Canvas engine for each size in memory.
    * It assembles the final `.zip` blob and prompts the browser to download it.

---
*This document is intended for AI Agents and developers to quickly grasp the architecture and data flow of the IconBase project without needing to read the entire source code.*
