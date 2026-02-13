/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9', // Sky 500
        secondary: '#64748b', // Slate 500
        danger: '#ef4444', // Red 500
        success: '#22c55e', // Green 500
        warning: '#f59e0b', // Amber 500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
