/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  safelist: ['input-xs', 'input-sm', 'input-md', 'input-lg'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter var', ...defaultTheme.fontFamily.sans] },
    },
  },
  plugins: [require('daisyui')],
}
