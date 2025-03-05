/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'custom-black': '#000000',
        'custom-red': '#AC3E31',
        'custom-dark-gray': '#484848',
        'custom-gold': '#DBAE58',
        'custom-light-gray': '#DADADA',
        'custom-navy': '#20283E',
        'custom-teal': '#488A99'
      },
      backgroundColor: {
        'custom-black': '#000000',
        'custom-red': '#AC3E31',
        'custom-dark-gray': '#484848',
        'custom-gold': '#DBAE58',
        'custom-light-gray': '#DADADA',
        'custom-navy': '#20283E',
        'custom-teal': '#488A99'
      },
      textColor: {
        'custom-black': '#000000',
        'custom-red': '#AC3E31',
        'custom-dark-gray': '#484848',
        'custom-gold': '#DBAE58',
        'custom-light-gray': '#DADADA',
        'custom-navy': '#20283E',
        'custom-teal': '#488A99'
      },
      borderColor: {
        'custom-black': '#000000',
        'custom-red': '#AC3E31',
        'custom-dark-gray': '#484848',
        'custom-gold': '#DBAE58',
        'custom-light-gray': '#DADADA',
        'custom-navy': '#20283E',
        'custom-teal': '#488A99'
      }
    },
  },
  plugins: [],
};