const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./pages/**/*.{html,js}", "./public/components/**.{js.jsx}"],
  content: ["./pages/**/*.{html,js}", "./public/components/**.{js.jsx}"],
  theme: {

    extend: {

    }
    
  },
  plugins: [],
}
