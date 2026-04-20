export type BgType = 'solid' | 'linear' | 'radial' | 'dots' | 'grid'

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
  { id: 'grad-sunset', name: '日落渐变', type: 'linear', colors: ['#ff7e5f', '#feb47b'] },
  { id: 'grad-ocean', name: '海洋渐变', type: 'linear', colors: ['#2E3192', '#1BFFFF'] },
  { id: 'grad-purple', name: '紫罗兰', type: 'linear', colors: ['#8E2DE2', '#4A00E0'] },
  { id: 'grad-midnight', name: '午夜深蓝', type: 'linear', colors: ['#232526', '#414345'] },
  { id: 'pattern-dots', name: '浅色波点', type: 'dots', colors: ['#f5f5f7', '#d1d1d6'], params: { spacing: 20, radius: 3 } },
  { id: 'pattern-grid', name: '深色网格', type: 'grid', colors: ['#1c1c1e', '#333336'], params: { spacing: 20, thickness: 2 } },
  { id: 'glow-blue', name: '蓝色光晕', type: 'radial', colors: ['#003366', '#000000'] },
  { id: 'glow-purple', name: '紫色光晕', type: 'radial', colors: ['#330066', '#000000'] }
]

export const getBackground = (id: string): BgConfig => {
  return BACKGROUNDS.find(b => b.id === id) || BACKGROUNDS[0]
}

export const getBgCss = (bg: BgConfig) => {
  if (bg.type === 'solid') return { background: bg.colors[0] }
  if (bg.type === 'linear') return { background: `linear-gradient(135deg, ${bg.colors[0]}, ${bg.colors[1]})` }
  if (bg.type === 'radial') return { background: `radial-gradient(circle, ${bg.colors[0]}, ${bg.colors[1]})` }
  if (bg.type === 'dots') return {
    backgroundColor: bg.colors[0],
    backgroundImage: `radial-gradient(${bg.colors[1]} 20%, transparent 20%)`,
    backgroundSize: '10px 10px',
    backgroundPosition: '0 0'
  }
  if (bg.type === 'grid') return {
    backgroundColor: bg.colors[0],
    backgroundImage: `linear-gradient(${bg.colors[1]} 1px, transparent 1px), linear-gradient(90deg, ${bg.colors[1]} 1px, transparent 1px)`,
    backgroundSize: '10px 10px'
  }
  return {}
}
