/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
    colors: {
      'white': '#f1f1f1',
      'black': '#010101',
      'primary': '#39db7d',
      'secondary': '#fc3b76',
      'bg-primary': '#141e22',
      'bg-highlight': '#1a262d',
      'text-primary': '#f1f1f1',
      'text-secondary': '#123123',
      'text-highlight': '#123123',


      'exemplo-WHITE_AND_DARK': {
        light: '#67e8f9',
        DEFAULT: '#06b6d4',
        dark: '#0e7490',
      },

    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}