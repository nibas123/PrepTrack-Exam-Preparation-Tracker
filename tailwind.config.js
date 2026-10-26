/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f6f9',
          100: '#e3ebf2',
          200: '#cad9e6',
          300: '#a3bfd4',
          400: '#759ebe',
          500: '#4e7fa8',
          600: '#35658e',
          700: '#2a5073',
          800: '#1b3a57',
          900: '#0f2942', // primary deep Oxford navy
          950: '#091827',
        },
        court: {
          50: '#fbf8f3',
          100: '#f5eee1',
          200: '#e9dac1',
          300: '#d9be97',
          400: '#c59d6a',
          500: '#a97f47',
          600: '#8c6333', // regal judicial bronze
          700: '#704c26',
          800: '#56381c',
          900: '#3d2512',
          950: '#231308',
        },
        success: {
          50: '#f2f9f5',
          100: '#e1f2e8',
          500: '#2e935a',
          600: '#1e7542',
          700: '#165c34',
        },
        warning: {
          50: '#fdf9ee',
          100: '#faefd4',
          500: '#c2891d',
          600: '#9e6d0e',
        },
        danger: {
          50: '#fdf3f3',
          100: '#fae3e3',
          500: '#d93838',
          600: '#b92424',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
