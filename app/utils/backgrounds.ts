export type BgType = 'solid' | 'linear' | 'radial' | 'dots' | 'grid' | 'stripes' | 'spotlight' | 'accent' | 'confetti'

export interface BgConfig {
  id: string
  name: string
  type: BgType
  colors: string[]
  params?: any
}

export const BACKGROUNDS: BgConfig[] = [
  { id: 'apple-dark', name: 'Apple 深色', type: 'solid', colors: ['#1c1c1e'] },
  { id: 'apple-light', name: 'Apple 浅色', type: 'solid', colors: ['#f5f5f7'] },
  { id: 'solid-black', name: '纯黑', type: 'solid', colors: ['#000000'] },
  { id: 'solid-white', name: '纯白', type: 'solid', colors: ['#FFFFFF'] },
  { id: 'solid-graphite', name: '石墨灰', type: 'solid', colors: ['#2c2c2e'] },
  { id: 'solid-cream', name: '奶油白', type: 'solid', colors: ['#fff7ed'] },
  { id: 'grad-sunset', name: '日落渐变', type: 'linear', colors: ['#ff7e5f', '#feb47b'] },
  { id: 'grad-ocean', name: '海洋渐变', type: 'linear', colors: ['#2E3192', '#1BFFFF'] },
  { id: 'grad-purple', name: '紫罗兰', type: 'linear', colors: ['#8E2DE2', '#4A00E0'] },
  { id: 'grad-midnight', name: '午夜深蓝', type: 'linear', colors: ['#232526', '#414345'] },
  { id: 'grad-lime', name: '青柠薄荷', type: 'linear', colors: ['#a8ff78', '#78ffd6'] },
  { id: 'grad-peach', name: '蜜桃奶昔', type: 'linear', colors: ['#ffecd2', '#fcb69f'] },
  { id: 'pattern-dots', name: '浅色波点', type: 'dots', colors: ['#f5f5f7', '#d1d1d6'], params: { spacing: 20, radius: 3 } },
  { id: 'pattern-grid', name: '深色网格', type: 'grid', colors: ['#1c1c1e', '#333336'], params: { spacing: 20, thickness: 2 } },
  { id: 'glow-blue', name: '蓝色光晕', type: 'radial', colors: ['#003366', '#000000'] },
  { id: 'glow-purple', name: '紫色光晕', type: 'radial', colors: ['#330066', '#000000'] },
  { id: 'stripes-slate', name: '斜纹条纹', type: 'stripes', colors: ['#0f172a', '#334155'], params: { spacing: 18, thickness: 6, angle: 135 } },
  { id: 'spotlight-rose', name: '玫瑰聚光', type: 'spotlight', colors: ['#fb7185', '#0b1220'], params: { cx: 0.25, cy: 0.2 } },
  { id: 'spotlight-sky', name: '天空聚光', type: 'spotlight', colors: ['#38bdf8', '#06121f'], params: { cx: 0.3, cy: 0.25 } },
  { id: 'accent-corner', name: '角落点缀', type: 'accent', colors: ['#0b1220', '#22c55e'], params: { cx: 0.15, cy: 0.15, r: 0.55 } },
  { id: 'accent-diagonal', name: '对角点缀', type: 'accent', colors: ['#111827', '#a855f7'], params: { band: 0.22 } },
  { id: 'confetti-mono', name: '微点噪声', type: 'confetti', colors: ['#0b1220', '#94a3b8'], params: { density: 0.06, seed: 1337 } }
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
