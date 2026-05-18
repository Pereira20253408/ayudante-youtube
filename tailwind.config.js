/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kids: {
          primary: '#FF4B4B', // Vibrant Red
          secondary: '#38BDF8', // Sky Blue
          accent: '#FACC15', // Yellow
          green: '#4ADE80', // Playful Green
          purple: '#A855F7', // Bright Purple
          bg: '#F8FAFC', // Light background
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'kids': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'kids-button': '0 4px 0 0 rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
