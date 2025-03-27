/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // macOS-style colors
        mac: {
          blue: '#0071e3',
          gray: '#f5f5f7',
          dark: '#1d1d1f',
          light: '#fbfbfd',
          border: '#d2d2d7',
          sidebar: '#f5f5f7',
          accent: '#06c',
          success: '#28cd41',
          warning: '#ff9f0a',
          error: '#ff3b30',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'San Francisco',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif'
        ],
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        120: '30rem',
      },
      borderRadius: {
        '4xl': '2rem',
        'mac': '0.5rem',
      },
      boxShadow: {
        'glow': '0 0 4px rgb(0 0 0 / 0.1)',
        'glow-lg': '0 0 8px rgb(0 0 0 / 0.1)',
        'mac': '0 1px 4px rgba(0, 0, 0, 0.1)',
        'mac-hover': '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s linear forwards',
        'fade-out': 'fade-out 0.5s linear forwards',
        'slide-in': 'slide-in 0.3s ease-out forwards',
        'slide-out': 'slide-out 0.3s ease-in forwards',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
} 