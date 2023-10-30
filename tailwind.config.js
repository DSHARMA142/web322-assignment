/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/*.html`],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['light'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
