/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          lime: '#D4F84B',
          'lime-hover': '#C3E838',
          'lime-muted': 'rgba(212, 248, 75, 0.15)',
        },
        obsidian: {
          DEFAULT: '#161719',
          surface: '#1E1F24',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        canvas: {
          DEFAULT: '#F4F5F8',
          dark: '#0E0F12',
        },
        slate: {
          850: '#151D2E',
          950: '#0B0F19',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.02), 0 6px 16px -4px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 10px 24px -4px rgba(0, 0, 0, 0.08)',
        floating: '0 12px 28px -6px rgba(0, 0, 0, 0.12), 0 8px 12px -4px rgba(0, 0, 0, 0.06)',
        darkTooltip: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
