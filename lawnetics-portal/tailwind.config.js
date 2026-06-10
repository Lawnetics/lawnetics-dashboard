/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand Primary ──
        org: {
          DEFAULT: '#e85020',
          dark:    '#c04010',
          light:   '#fff3ee',
          mid:     '#fde8e0',
        },
        // ── Cyan ──
        cyan: {
          DEFAULT: '#00aadd',
          dark:    '#0090bb',
          light:   '#e6f7fd',
        },
        // ── Navy ──
        navy: {
          DEFAULT: '#0d2045',
          dark:    '#1a3a72',
          light:   '#e8eef8',
        },
        // ── Dark (Sidebar) ──
        dark: {
          DEFAULT: '#12192c',
          2:       '#1c2538',
          3:       '#242f44',
        },
        // ── Gold ──
        gold: {
          DEFAULT: '#c89b30',
          light:   '#fdf5e0',
        },
        // ── Green ──
        green: {
          DEFAULT: '#1a7a4a',
          light:   '#e6f5ed',
        },
        // ── Red ──
        red: {
          DEFAULT: '#c0392b',
          light:   '#fdeaea',
        },
        // ── Purple ──
        purple: {
          DEFAULT: '#7c3aed',
          light:   '#f3eeff',
        },
        // ── Backgrounds ──
        bg: {
          DEFAULT: '#f0f4fb',
          2:       '#e5eaf5',
        },
        // ── Borders ──
        border: {
          DEFAULT: '#d8e0ee',
          2:       '#c0ccdf',
        },
        // ── Text ──
        text: {
          DEFAULT: '#1a2540',
          2:       '#4a5e7a',
          3:       '#8a9bb5',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono:  ['Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        '3xs': ['0.55rem',  { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        DEFAULT: '7px',
        card:    '12px',
        modal:   '14px',
      },
      boxShadow: {
        sm:  '0 2px 12px rgba(13,32,69,.08)',
        md:  '0 6px 24px rgba(13,32,69,.12)',
        lg:  '0 20px 60px rgba(13,32,69,.20)',
        org: '0 4px 16px rgba(232,80,32,.38)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        bounceIn: {
          '0%':   { transform: 'scale(.84)', opacity: 0 },
          '60%':  { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)',   opacity: 1 },
        },
        slideLeft: {
          from: { opacity: 0, transform: 'translateX(18px)' },
          to:   { opacity: 1, transform: 'translateX(0)' },
        },
        pulse: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(232,80,32,.4)' },
          '70%':     { boxShadow: '0 0 0 8px rgba(232,80,32,0)' },
        },
        shimmer: {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0.3 },
        },
      },
      animation: {
        fadeUp:    'fadeUp 0.25s ease forwards',
        fadeIn:    'fadeIn 0.2s ease forwards',
        bounceIn:  'bounceIn 0.5s ease forwards',
        slideLeft: 'slideLeft 0.25s ease forwards',
        pulse:     'pulse 2s infinite',
        shimmer:   'shimmer 1s infinite',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
