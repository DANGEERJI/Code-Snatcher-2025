/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",   // ✅ Include all JSX/JS/TS files inside app
    "./src/pages/**/*.{js,jsx,ts,tsx}", // if using pages directory
    "./src/components/**/*.{js,jsx,ts,tsx}" // components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
