/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#08162B',
          900: '#0E1F3A',
          800: '#18305A',
          700: '#27426F',
          600: '#3B5683',
        },
        paper: {
          DEFAULT: '#FBFAF8',
          deep: '#F2F0EB',
        },
        line: '#E2DFD8',
        ink: {
          DEFAULT: '#14213A',
          muted: '#4E586B',
        },
        accent: {
          DEFAULT: '#2E66D1',
          hover: '#2457BA',
          soft: '#E7EEFB',
          light: '#9BBCF3',
        },
      },
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        'cell-in': {
          from: { opacity: '0', transform: 'scaleY(0.4)' },
          to: { opacity: '1', transform: 'scaleY(1)' },
        },
        'panel-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'cell-in': 'cell-in 420ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'panel-in': 'panel-in 200ms ease-out both',
      },
    },
  },
  plugins: [],
};
