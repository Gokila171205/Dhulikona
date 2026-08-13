/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#0F265C', // Deep government style blue
          light: '#284E9C',
        },
        water: {
          blue: '#0085CA', // Water blue
          light: '#4CB5F5',
        },
        success: '#166534', // Green
        warning: '#D97706', // Amber
        danger: '#DC2626', // Red
        background: {
          default: '#F3F4F6', // Light gray background
          paper: '#FFFFFF', // White cards
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
