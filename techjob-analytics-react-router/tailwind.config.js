/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'lg:ml-16',
    'lg:ml-60',
    'lg:ml-64',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Untitled Serif"', 'ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['"ABC Diatype Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Untitled Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '40px',
        'card-mobile': '28px',
        'button': '100px',
        'pill': '9999px',
        '3xl': '40px',
        'full': '9999px',
      },
      maxWidth: {
        'site': '1432px',
      },
      spacing: {
        'section': '64px',
        'card': '40px',
      },
      colors: {
        parchment: '#f6f3f1',
        'lake-blue': '#2b59d1',
        'periwinkle-mist': '#cfdaf5',
        'sky-blue': '#a0b5eb',
        mint: '#a7fccd',
        coral: '#ff9473',
        gold: '#ecda98',
        crimson: '#f37a0a',
        'off-black': '#242424',
        ink: '#000000',
        graphite: '#4e4d4d',
        smoke: '#797776',
        ash: '#cecac8',
        // Semantic aliases
        canvas: {
          DEFAULT: '#f6f3f1',
          warm: '#f6f3f1',
          dark: '#242424',
        },
        surface: {
          DEFAULT: '#f6f3f1',
          elevated: '#cfdaf5',
          dark: '#242424',
        },
        border: {
          DEFAULT: '#cecac8',
          ash: '#cecac8',
        },
      },
      boxShadow: {
        ambient: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        card: 'none',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.15s ease-out',
      },
    },
  },
  plugins: [],
}

