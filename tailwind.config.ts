import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        apple: {
          dark: '#1c1c1e',
          light: '#f5f5f7',
          blue: '#007aff',
          gray: '#8e8e93'
        }
      }
    }
  }
}