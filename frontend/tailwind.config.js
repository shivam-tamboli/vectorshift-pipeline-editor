/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0f1015',
        surface: {
          DEFAULT: '#141620',
          raised: '#1a1d2b',
          overlay: '#0c0e18',
        },
        bdr: {
          DEFAULT: '#1e2236',
          strong: '#252a3e',
        },
        tx: {
          primary: '#e2e8f0',
          secondary: '#8892a4',
          muted: '#4a5068',
        },
        brand: '#6366f1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

