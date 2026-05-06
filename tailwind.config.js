/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDF6EE',
        'cream-dark': '#F5EBD8',
        terracotta: {
          DEFAULT: '#C4714A',
          light: '#E8956D',
          dark: '#A05A35',
          pale: '#F5DDD0',
        },
        sage: {
          DEFAULT: '#7A9E82',
          light: '#A8C9B0',
          dark: '#557A5E',
          pale: '#DFF0E3',
        },
        peach: '#F0C4A8',
        warm: {
          dark: '#3D2C1E',
          mid: '#6B4E38',
          light: '#8C7260',
          pale: '#C4AD9D',
        },
        surface: '#FFFFFF',
        'surface-warm': '#FFF8F3',
        border: '#E8D5C4',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        serif: ['Handlee', 'cursive'],
        hand: ['Handlee', 'cursive'],
      },
      boxShadow: {
        warm: '0 2px 16px rgba(196,113,74,0.14)',
        'warm-lg': '0 8px 32px rgba(196,113,74,0.18)',
        card: '0 1px 8px rgba(61,44,30,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
      },
    },
  },
  plugins: [],
}
