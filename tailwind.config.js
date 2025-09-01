/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '375px', 
        'md': '414px',
        'lg': '768px',
        'xl': '1024px',
        '2xl': '1280px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        '44': '44px',
      },
      minWidth: {
        '44': '44px',
      },
      colors: {
        pilotRed: '#9b0806',     // lighter red
        pilotRedDark: '#770805', // darker red
      },
    },
  },
  plugins: [],
}
