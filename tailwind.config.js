/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        textHighlited: '#ffffff',
        backgroundButton: '#586f96',
        backgroundButtonHover: '#323a4b',
      },
      fontSize: {
        size1: '15px',
        size2: '17px',
        size3: '19px',
        size4: '21px',
        size5: '23px',
        size6: '30px',
      },
      animation: {
        fadeIn: 'fadeIn .15s ease-in-out',
      },

      keyframes: () => ({
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 0.2 },
        },
      }),
    },
  },
  plugins: [],
};
