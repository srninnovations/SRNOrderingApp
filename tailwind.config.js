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
        primary: '#0B3954',
        secondary: '#087E8B',
        light: '#BFD7EA',
        warning: '#FF5A5F',
        warningDark: '#C81D25',
        amber: '#ffc107',
        clear: '#fefefe',
      },
    },
  },
  plugins: [nativewind()],
};
