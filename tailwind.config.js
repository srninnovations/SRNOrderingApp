/** @type {import('tailwindcss').Config} */
const nativewind = require('nativewind/tailwind/native');

module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          primary: '#1C77C3',
          secondary: '#39A9DB',
          light: '#40BCD8',
          warning: '#F39237',
          danger: '#D63230',
          amber: '#ffc107',
          grey: '#666',
          dark: '#000',
          'border-color': 'rgb(206, 212, 218)',
        },
      },
    },
  },
  plugins: [nativewind()],
};
