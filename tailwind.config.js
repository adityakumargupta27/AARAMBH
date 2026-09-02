/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#7892b0',
          500: '#486581',
          600: '#334e68',
          700: '#243b53',
          800: '#102a43',
          900: '#0a1f33',
          950: '#061425',
        },
        steel: {
          50: '#f4f6f8',
          100: '#e9eef2',
          200: '#d3dde4',
          300: '#aab8c4',
          400: '#7e94a4',
          500: '#5d7385',
          600: '#475a6b',
          700: '#364756',
          800: '#273540',
          900: '#1b2730',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '11': ['11px', { lineHeight: '1.4' }],
        '13': ['13px', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
      },
      borderRadius: {
        'lg': '8px',
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'dropdown': '0 4px 16px -2px rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        'modal': '0 8px 32px -4px rgba(0, 0, 0, 0.16), 0 2px 8px 0 rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        '150': '150ms',
      },
    },
  },
  plugins: [],
};
