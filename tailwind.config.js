/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        textNormal: '#ffffff',
        textHighlited: '#3ffba2',
        textDarkDs: 'rgb(255 255 255 / 0.7)',
        backgroundButton: 'rgb(255 255 255 / 0.1)',
        backgroundButtonHover: ' rgb(255 255 255 / 0.2)',
      },
      animation: {
        fadeIn: 'fadeIn .15s ease-in-out',
        // TODO: Return and fix animations
        move1: 'move1 20s linear infinite',
        move2: 'move2 30s linear infinite',
        move3: 'move3 20s linear infinite',
        move4: 'move4 40s linear infinite',
        move5: 'move5 20s  ease-in-out infinite',
        move6: 'move6 18s linear infinite',
        move7: 'move7 18s linear infinite',
      },

      keyframes: () => ({
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 0.2 },
        },
        move1: {
          '0%': { top: '0px', left: '0px', opacity: 0 },
          '5%': { opacity: 0.2 },
          '8%': { opacity: 0.3 },
          '9%': { opacity: 0.2 },
          '14%': { opacity: 0.2 },
          '18%': { opacity: 0.3 },
          '22%': { opacity: 0.3 },
          '30%': { opacity: 0.2 },
          '36%': { top: '500px', left: '900px' },
          '100%': { top: '0px', left: '0px' },
        },

        move2: {
          '0%': { top: '400px', left: '400px', opacity: 0, scale: '2' },
          '25%': { opacity: 0.3, top: '420px', left: '320px' },
          '50%': { opacity: 0.2, top: '310px', left: '410px' },
          '100%': { top: '400px', left: '400px', opacity: 0 },
        },

        move3: {
          '0%': { top: '200px', left: '800px', opacity: 0 },
          '20%': { opacity: 0.2, scale: '1' },
          '25%': { opacity: 0.2, scale: '3' },
          '50%': { opacity: 0.3, scale: '1.4' },
          '55%': { opacity: 0 },
          '100%': { top: '200px', left: '800px', opacity: 0, cale: '1' },
        },

        move4: {
          '0%': { top: '-20%', right: '120%', opacity: 0, scale: '2' },
          '25%': { top: '30%', right: '70%', opacity: 0.2 },
          '50%': { top: '55%', right: '35%', opacity: 0.3 },
          '100%': { top: '-20%', right: '120%', opacity: 0 },
        },

        move5: {
          '0%': { bottom: '0%', right: '0%', opacity: 0, scale: '8' },
          '25%': { opacity: 0.4, bottom: '40%', right: '90%' },
          '70%': { opacity: 0.3, bottom: '56%' },
          '100%': { bottom: '0%', right: '0%', opacity: 0 },
        },

        move6: {
          '0%': { bottom: '0%', left: '0%', opacity: 0, scale: '4' },
          '25%': { opacity: 0.3, bottom: '40%' },
          '50%': { opacity: 0.2, bottom: '56%', scale: '2' },
          '80%': { top: '45%', left: '0%', opacity: 0, scale: '2' },
          '100%': { bottom: '0%', left: '0%', opacity: 0, scale: '4' },
        },

        move7: {
          '0%': { bottom: '0%', right: '0%', opacity: 0, scale: '4' },
          '25%': { opacity: 0.3, bottom: '40%' },
          '60%': { opacity: 0.1, bottom: '56%', scale: '2' },
          '80%': { top: '45%', left: '56%', opacity: 0, scale: '3' },
          '100%': { bottom: '0%', right: '0%', opacity: 0, scale: '4' },
        },
      }),
    },
  },
  plugins: [],
};
