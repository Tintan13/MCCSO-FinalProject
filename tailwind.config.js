/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./views/includes/**/*.ejs",
    "./public/**/*.{html,js,css}",
    "./src/**/*.{html,js,css}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}