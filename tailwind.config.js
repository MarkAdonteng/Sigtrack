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
        'primary-bg': 'bg-gray-300', 
        'secondary-bg': ' rgba(0, 0, 0, 0.9)', 
        'settingsAndbell-bg' : 'bg-gray-500',
        'alternate-bg': 'white', 

      },
      textColor: {
        // Add your custom text colors here
        'primary-text': 'black',
        'secondary-text':'bg-gray-500',
        'alternate-text': 'black',
       
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

