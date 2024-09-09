import {nextui} from '@nextui-org/theme'
const plugin = require('tailwindcss/plugin');


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(),plugin(function({addUtilities}) {
    addUtilities({
      '.backface-visible': {
        'backface-visibility': 'visible',
      },
      '.backface-hidden': {
        'backface-visibility': 'hidden',
      }
    })
  })],
}




