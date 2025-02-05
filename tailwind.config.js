/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B4F96',   // Roxo
        secondary: '#FFA500', // Laranja
        neutral: '#E5E5E5',   // Cinza claro
        highlight: '#4B9CD3', // Azul claro
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Adiciona a fonte "Inter"
      },
    },
  },
  plugins: [],
};
