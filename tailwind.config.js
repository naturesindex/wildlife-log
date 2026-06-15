/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDF9F5',
          100: '#FDF0E6',
          200: '#F5E4D0',
          300: '#EDD1B5',
        },
        forest: {
          900: '#0F2318',
          800: '#1C3A27',
          700: '#274D35',
          600: '#2A5A3A',
          500: '#3A7A50',
          400: '#4A9A65',
        },
        terracotta: {
          900: '#7A3A18',
          800: '#9E4D22',
          700: '#B5622E',
          600: '#C8733A',
          500: '#D98850',
        },
      },
    },
  },
  plugins: [],
};
