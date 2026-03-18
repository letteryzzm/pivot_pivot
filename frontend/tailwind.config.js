/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        'stage1': '#0ea5e9',
        'stage2': '#10b981',
      },
    },
  },
  plugins: [],
}
