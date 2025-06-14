/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Add Poppins font
      },
      colors: {
        'dream-green': '#5BA191', // Add custom color
      },
    },
  },
  plugins: [],
};
