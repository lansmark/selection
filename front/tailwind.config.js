/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('tailwindcss/presets/compat')], // ✅ use built-in compat preset
  theme: {
    extend: {},
  },
  plugins: [],
}
