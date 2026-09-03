/** @type {import('tailwindcss').Config} */

// ============================================================
// AARAMBHA — Dark Intelligence Design tokens
// Government intelligence platform / enterprise analytics.
// Deep slate-blue backgrounds, cyan accents, semantic risk ramp.
// Red is reserved exclusively for high-priority risk — never brand.
// ============================================================

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---- Brand: deep navy (dark-mode optimized) ----
        navy: {
          50: '#e8edf3',
          100: '#c5d1e0',
          200: '#9fb3c8',
          300: '#7892b0',
          400: '#5a7799',
          500: '#3d5d82',
          600: '#2d4a6b',
          700: '#1e3854',
          800: '#102a43',
          900: '#0a1f33',
          950: '#061425',
        },
        // ---- Secondary: steel blue ----
        steel: {
          50: '#e8ecf0',
          100: '#c8d2dc',
          200: '#a5b5c4',
          300: '#8299ac',
          400: '#647e94',
          500: '#4a647d',
          600: '#3a5068',
          700: '#2c3e53',
          800: '#1f2e3e',
          900: '#14202d',
        },
        // ---- Semantic risk ramp (dark-mode optimized) ----
        risk: {
          normal: '#34d399',
          'normal-text': '#6ee7b7',
          'normal-bg': 'rgba(5, 150, 105, 0.12)',
          'normal-border': 'rgba(5, 150, 105, 0.25)',

          watch: '#fbbf24',
          'watch-text': '#fcd34d',
          'watch-bg': 'rgba(217, 119, 6, 0.12)',
          'watch-border': 'rgba(217, 119, 6, 0.25)',

          review: '#fb923c',
          'review-text': '#fdba74',
          'review-bg': 'rgba(234, 88, 12, 0.12)',
          'review-border': 'rgba(234, 88, 12, 0.2)',

          high: '#f87171',
          'high-text': '#fca5a5',
          'high-bg': 'rgba(220, 38, 38, 0.15)',
          'high-border': 'rgba(220, 38, 38, 0.25)',
        },
        // ---- Application surfaces (dark) ----
        surface: {
          page: '#0b1120',
          card: 'rgba(15, 23, 42, 0.65)',
          sunken: 'rgba(15, 23, 42, 0.4)',
          inverse: '#f1f5f9',
          elevated: 'rgba(30, 41, 59, 0.6)',
        },
        // ---- Accent: cyan/sky ----
        accent: {
          DEFAULT: '#38bdf8',
          dim: 'rgba(56, 189, 248, 0.15)',
          glow: 'rgba(56, 189, 248, 0.2)',
        },
      },
      fontFamily: {
        sans: [
          'Inter var',
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      // Explicit type scale — page 30 / section 19 / card 14 / body 13 / meta 11
      fontSize: {
        meta: ['11px', { lineHeight: '1.45' }],
        micro: ['12px', { lineHeight: '1.45' }],
        body: ['13px', { lineHeight: '1.55' }],
        'body-lg': ['14px', { lineHeight: '1.6' }],
        card: ['14px', { lineHeight: '1.4' }],
        'card-lg': ['16px', { lineHeight: '1.4' }],
        section: ['19px', { lineHeight: '1.3' }],
        'section-lg': ['22px', { lineHeight: '1.25' }],
        page: ['30px', { lineHeight: '1.15' }],
        stat: ['26px', { lineHeight: '1.1' }],
        'stat-lg': ['34px', { lineHeight: '1.05' }],
        'stat-xl': ['44px', { lineHeight: '1' }],
      },
      // 8px system
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        sidebar: '260px',
        'sidebar-collapsed': '64px',
        header: '64px',
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(0, 0, 0, 0.3)',
        'card-hover':
          '0 4px 20px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.06)',
        dropdown:
          '0 8px 32px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.08)',
        modal:
          '0 20px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(148, 163, 184, 0.08)',
        'focus-sky': '0 0 0 3px rgba(56, 189, 248, 0.15)',
        glow: '0 0 30px -8px rgba(56, 189, 248, 0.25)',
        'glow-lg': '0 0 50px -12px rgba(59, 130, 246, 0.3)',
        'inner-glow': 'inset 0 1px 0 0 rgba(148, 163, 184, 0.06)',
      },
      transitionDuration: {
        120: '120ms',
        150: '150ms',
        250: '250ms',
        350: '350ms',
      },
      maxWidth: {
        prose: '68ch',
        content: '1600px',
      },
      zIndex: {
        sidebar: '30',
        header: '40',
        dropdown: '50',
        drawer: '60',
        modal: '70',
        toast: '80',
      },
      animation: {
        'fade-in': 'fadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 450ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 3s linear infinite',
        breathe: 'breathe 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
