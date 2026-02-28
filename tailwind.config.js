/** @type {import('tailwindcss').Config} */
module.exports = {

  theme: {
    extend: {
      spacing: {
        275: '275px',
        130: '130px',
        65: '65px',
      },
    },
  },

  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};