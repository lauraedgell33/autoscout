/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AutoScout24 Official Brand Colors
        'as24-blue': {
          DEFAULT: '#003281',
          dark: '#002060',
          light: '#0047AB',
        },
        'as24-orange': {
          DEFAULT: '#FFA500',
          dark: '#FF8C00',
          light: '#FFB733',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
