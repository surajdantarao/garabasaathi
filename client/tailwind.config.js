/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        garba: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f472b6',
          400: '#e11d48',
          500: '#be123c',
          600: '#9f1239',
          700: '#881337',
          deepPurple: '#2d124d',
          darkBg: '#1a0b2e',
          gold: '#f59e0b',
          goldLight: '#fef3c7',
          festiveOrange: '#f97316',
          festivePink: '#ec4899',
          festiveViolet: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'garba-gradient': 'linear-gradient(135deg, #2d124d 0%, #4c1d95 40%, #be123c 100%)',
        'hero-gradient': 'radial-gradient(circle at top, rgba(236,72,153,0.25) 0%, rgba(45,18,77,0.95) 70%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      }
    },
  },
  plugins: [],
}
