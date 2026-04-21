export type BgType = 'solid' | 'linear' | 'radial' | 'dots' | 'grid' | 'stripes' | 'spotlight' | 'accent' | 'confetti' | 'glass' | 'mesh' | 'noise' | 'checkerboard'

export interface BgConfig {
  id: string
  name: string
  type: BgType
  colors: string[]
  params?: any
}

export const BACKGROUNDS: BgConfig[] = [
  { id: 'apple-dark', name: 'Apple Dark', type: 'solid', colors: ['#1c1c1e'] },
  { id: 'apple-light', name: 'Apple Light', type: 'solid', colors: ['#f5f5f7'] },
  { id: 'solid-black', name: 'Pure Black', type: 'solid', colors: ['#000000'] },
  { id: 'solid-white', name: 'Pure White', type: 'solid', colors: ['#FFFFFF'] },
  { id: 'solid-graphite', name: 'Graphite', type: 'solid', colors: ['#2c2c2e'] },
  { id: 'solid-cream', name: 'Cream White', type: 'solid', colors: ['#fff7ed'] },
  { id: 'grad-sunset', name: 'Sunset', type: 'linear', colors: ['#ff7e5f', '#feb47b'] },
  { id: 'grad-ocean', name: 'Ocean', type: 'linear', colors: ['#2E3192', '#1BFFFF'] },
  { id: 'grad-purple', name: 'Violet', type: 'linear', colors: ['#8E2DE2', '#4A00E0'] },
  { id: 'grad-midnight', name: 'Midnight', type: 'linear', colors: ['#232526', '#414345'] },
  { id: 'grad-lime', name: 'Lime Mint', type: 'linear', colors: ['#a8ff78', '#78ffd6'] },
  { id: 'grad-peach', name: 'Peach Shake', type: 'linear', colors: ['#ffecd2', '#fcb69f'] },
  { id: 'pattern-dots', name: 'Light Dots', type: 'dots', colors: ['#f5f5f7', '#d1d1d6'], params: { spacing: 20, radius: 3 } },
  { id: 'pattern-grid', name: 'Dark Grid', type: 'grid', colors: ['#1c1c1e', '#333336'], params: { spacing: 20, thickness: 2 } },
  { id: 'glow-blue', name: 'Blue Glow', type: 'radial', colors: ['#003366', '#000000'] },
  { id: 'glow-purple', name: 'Purple Glow', type: 'radial', colors: ['#330066', '#000000'] },
  { id: 'stripes-slate', name: 'Slate Stripes', type: 'stripes', colors: ['#0f172a', '#334155'], params: { spacing: 18, thickness: 6, angle: 135 } },
  { id: 'spotlight-rose', name: 'Rose Spotlight', type: 'spotlight', colors: ['#fb7185', '#0b1220'], params: { cx: 0.25, cy: 0.2 } },
  { id: 'spotlight-sky', name: 'Sky Spotlight', type: 'spotlight', colors: ['#38bdf8', '#06121f'], params: { cx: 0.3, cy: 0.25 } },
  { id: 'accent-corner', name: 'Corner Accent', type: 'accent', colors: ['#0b1220', '#22c55e'], params: { cx: 0.15, cy: 0.15, r: 0.55 } },
  { id: 'accent-diagonal', name: 'Diagonal Accent', type: 'accent', colors: ['#111827', '#a855f7'], params: { band: 0.22 } },
  { id: 'confetti-mono', name: 'Confetti Noise', type: 'confetti', colors: ['#0b1220', '#94a3b8'], params: { density: 0.06, seed: 1337 } },
  { id: 'glass-green-glow', name: 'Glass Glow', type: 'glass', colors: ['#e5e7eb', 'rgba(255,255,255,0.8)', 'rgba(34,197,94,0.4)'] },
  { id: 'mesh-aurora', name: 'Aurora Mesh', type: 'mesh', colors: ['#0f172a', '#3b82f6', '#8b5cf6', '#10b981'] },
  { id: 'mesh-ocean', name: 'Ocean Mesh', type: 'mesh', colors: ['#020617', '#0369a1', '#0284c7', '#0891b2'] },
  { id: 'mesh-holo', name: 'Holo Mesh', type: 'mesh', colors: ['#ffffff', '#fbcfe8', '#bfdbfe', '#a7f3d0'] },
  { id: 'mesh-flame', name: 'Flame Mesh', type: 'mesh', colors: ['#450a0a', '#ef4444', '#f97316', '#eab308'] },
  { id: 'noise-charcoal', name: 'Charcoal Noise', type: 'noise', colors: ['#1e293b'], params: { intensity: 15 } },
  { id: 'noise-sand', name: 'Sand Noise', type: 'noise', colors: ['#fde047'], params: { intensity: 10 } },
  { id: 'check-classic', name: 'Classic Check', type: 'checkerboard', colors: ['#ffffff', '#000000'], params: { size: 24 } },
  { id: 'check-pink', name: 'Pink Check', type: 'checkerboard', colors: ['#ffffff', '#fbcfe8'], params: { size: 32 } },
  { id: 'check-mint', name: 'Mint Check', type: 'checkerboard', colors: ['#ffffff', '#a7f3d0'], params: { size: 16 } },
  { id: 'stripes-candy', name: 'Candy Stripes', type: 'stripes', colors: ['#ffffff', '#f472b6'], params: { spacing: 20, thickness: 10, angle: 45 } },
  { id: 'stripes-warn', name: 'Warning Stripes', type: 'stripes', colors: ['#facc15', '#000000'], params: { spacing: 24, thickness: 12, angle: -45 } },
  { id: 'glow-cyber', name: 'Cyber Glow', type: 'radial', colors: ['#ec4899', '#172554'] },
  { id: 'glow-emerald', name: 'Emerald Glow', type: 'radial', colors: ['#10b981', '#064e3b'] },
  { id: 'grid-blueprint', name: 'Blueprint Grid', type: 'grid', colors: ['#1e3a8a', '#60a5fa'], params: { spacing: 24, thickness: 1 } },
  { id: 'dots-blueprint', name: 'Blueprint Dots', type: 'dots', colors: ['#1e3a8a', '#93c5fd'], params: { spacing: 16, radius: 2 } },
  { id: 'accent-slash', name: 'Slash Accent', type: 'accent', colors: ['#ffffff', '#ef4444'], params: { band: 0.1 } },
  { id: 'glass-frost', name: 'Frost Glass', type: 'glass', colors: ['#f8fafc', 'rgba(255,255,255,0.9)', 'rgba(226,232,240,0.5)'] },
  { id: 'glass-obsidian', name: 'Obsidian Glass', type: 'glass', colors: ['#0f172a', 'rgba(255,255,255,0.15)', 'rgba(56,189,248,0.2)'] },
  { id: 'mesh-sunset', name: 'Sunset Mesh', type: 'mesh', colors: ['#fca5a5', '#fcd34d', '#f472b6', '#c084fc'] },
  { id: 'mesh-forest', name: 'Forest Mesh', type: 'mesh', colors: ['#064e3b', '#047857', '#065f46', '#10b981'] },
  { id: 'noise-crimson', name: 'Crimson Noise', type: 'noise', colors: ['#7f1d1d'], params: { intensity: 12 } },
  { id: 'noise-paper', name: 'Paper Noise', type: 'noise', colors: ['#f5f5f4'], params: { intensity: 8 } },
  { id: 'check-yellow', name: 'Lemon Check', type: 'checkerboard', colors: ['#ffffff', '#fde047'], params: { size: 24 } },
  { id: 'check-slate', name: 'Slate Check', type: 'checkerboard', colors: ['#0f172a', '#1e293b'], params: { size: 32 } },
  { id: 'stripes-mint', name: 'Mint Stripes', type: 'stripes', colors: ['#ffffff', '#6ee7b7'], params: { spacing: 16, thickness: 8, angle: 135 } },
  { id: 'stripes-neon', name: 'Neon Stripes', type: 'stripes', colors: ['#000000', '#39ff14'], params: { spacing: 20, thickness: 4, angle: 45 } },
  { id: 'glow-amber', name: 'Amber Glow', type: 'radial', colors: ['#d97706', '#451a03'] },
  { id: 'glow-indigo', name: 'Indigo Glow', type: 'radial', colors: ['#4f46e5', '#1e1b4b'] },
  { id: 'grid-matrix', name: 'Matrix Grid', type: 'grid', colors: ['#000000', '#22c55e'], params: { spacing: 16, thickness: 1 } },
  { id: 'grid-retro', name: 'Retro Grid', type: 'grid', colors: ['#2e1065', '#ec4899'], params: { spacing: 20, thickness: 2 } },
  { id: 'dots-retro', name: 'Retro Dots', type: 'dots', colors: ['#2e1065', '#d8b4fe'], params: { spacing: 24, radius: 4 } },
  { id: 'dots-matrix', name: 'Matrix Dots', type: 'dots', colors: ['#000000', '#4ade80'], params: { spacing: 12, radius: 1 } },
  { id: 'accent-corner-blue', name: 'Blue Corner', type: 'accent', colors: ['#020617', '#3b82f6'], params: { cx: 0.85, cy: 0.15, r: 0.6 } }
]

export const getBackground = (id: string): BgConfig => {
  return BACKGROUNDS.find(b => b.id === id) || BACKGROUNDS[0]
}

export const getBgCss = (bg: BgConfig) => {
  if (bg.type === 'solid') return { background: bg.colors[0] }
  if (bg.type === 'linear') return { background: `linear-gradient(135deg, ${bg.colors[0]}, ${bg.colors[1]})` }
  if (bg.type === 'radial') return { background: `radial-gradient(circle, ${bg.colors[0]}, ${bg.colors[1]})` }
  if (bg.type === 'dots') {
    const spacing = bg.params?.spacing || 20
    const dot = bg.params?.radius || 3
    const dotPct = Math.max(5, Math.min(45, (dot / spacing) * 100))
    return {
      backgroundColor: bg.colors[0],
      backgroundImage: `radial-gradient(${bg.colors[1]} ${dotPct}%, transparent ${dotPct}%)`,
      backgroundSize: `${spacing}px ${spacing}px`,
      backgroundPosition: '0 0'
    }
  }
  if (bg.type === 'grid') {
    const spacing = bg.params?.spacing || 20
    const thickness = bg.params?.thickness || 1
    return {
      backgroundColor: bg.colors[0],
      backgroundImage: `linear-gradient(${bg.colors[1]} ${thickness}px, transparent ${thickness}px), linear-gradient(90deg, ${bg.colors[1]} ${thickness}px, transparent ${thickness}px)`,
      backgroundSize: `${spacing}px ${spacing}px`
    }
  }
  if (bg.type === 'stripes') {
    const angle = bg.params?.angle || 135
    const spacing = bg.params?.spacing || 18
    const thickness = bg.params?.thickness || 6
    return {
      backgroundColor: bg.colors[0],
      backgroundImage: `repeating-linear-gradient(${angle}deg, ${bg.colors[1]} 0 ${thickness}px, transparent ${thickness}px ${spacing}px)`
    }
  }
  if (bg.type === 'spotlight') {
    const cx = Math.round((bg.params?.cx ?? 0.25) * 100)
    const cy = Math.round((bg.params?.cy ?? 0.2) * 100)
    return {
      backgroundImage: `radial-gradient(circle at ${cx}% ${cy}%, ${bg.colors[0]}, ${bg.colors[1]})`
    }
  }
  if (bg.type === 'accent') {
    const band = bg.params?.band
    if (typeof band === 'number') {
      const w = Math.max(5, Math.min(40, band * 100))
      const start = 55
      return {
        backgroundImage: `linear-gradient(135deg, ${bg.colors[0]} 0 ${start}%, ${bg.colors[1]} ${start}% ${start + w}%, ${bg.colors[0]} ${start + w}% 100%)`
      }
    }
    const cx = Math.round((bg.params?.cx ?? 0.15) * 100)
    const cy = Math.round((bg.params?.cy ?? 0.15) * 100)
    const r = Math.round((bg.params?.r ?? 0.55) * 100)
    return {
      backgroundImage: `radial-gradient(circle at ${cx}% ${cy}%, ${bg.colors[1]} 0 ${r}%, ${bg.colors[0]} ${r}% 100%)`
    }
  }
  if (bg.type === 'confetti') {
    return {
      backgroundColor: bg.colors[0],
      backgroundImage: `radial-gradient(${bg.colors[1]} 1px, transparent 1px)`,
      backgroundSize: '12px 12px'
    }
  }
  return {}
}
