import type { Config } from 'tailwindcss';

/**
 * 색상은 globals.css의 CSS 변수(라이트/다크 amber 토큰)를 그대로 참조한다.
 * next-themes가 <html data-theme="dark|light">를 토글하면 변수 값이 바뀐다.
 */
const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        signal: 'var(--signal)',
        wash: 'var(--wash)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      maxWidth: {
        deck: '1180px',
        content: '900px',
        prose: '720px',
      },
      boxShadow: {
        card: 'var(--shadow)',
      },
      keyframes: {
        'menu-drop': {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to: { opacity: '1', transform: 'none' },
        },
        // 모바일 검색 바텀시트: 화면 아래에서 위로 올라옴
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'none' },
        },
      },
      animation: {
        'menu-drop': 'menu-drop 0.18s ease',
        'sheet-up': 'sheet-up 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
