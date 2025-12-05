/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('tailwindcss/presets/compat')],

  theme: {
    extend: {
      keyframes: {
        "select-brandLift": {
          "0%": {
            transform: "translateY(0) scale(1)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          },
          "60%": {
            transform: "translateY(-4px) scale(1.03)",
            boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
          },
          "100%": {
            transform: "translateY(0) scale(1)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          },
        },
      },

      animation: {
        "select-brandLift": "select-brandLift 0.35s ease-out",
      },
    },
  },

  plugins: [],
}
