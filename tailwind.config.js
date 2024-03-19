/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        // Add your custom background colors here
        'primary-bg': 'rgba(0, 0, 10, 0.8)', 
        'secondary-bg': ' rgba(0, 0, 0, 0.9)', 
        'settingsAndbell-bg' : 'rgba(116, 116, 116, 1)'

      },
      textColor: {
        // Add your custom text colors here
        'primary-text': 'rgba(217, 217, 217, 1)',
        'secondary-text':'rgba(217, 217, 217, 1)',
       
      },
    },
  },
  plugins: [],
}

