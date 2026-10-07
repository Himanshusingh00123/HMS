/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Reference image palette: Dark teal/green, golden accents, soft blue-gray background
        teal: {
          sidebar: '#1B3636',
          dark: '#142929',
          card: '#203F3E',
          surface: '#244746',
          border: '#2C5251',
          light: '#365F5E',
          muted: '#8CA5A2',
        },
        gold: {
          DEFAULT: '#C6922A',
          hover: '#B08020',
          dark: '#9A6E18',
          light: '#F8F1E1',
          accent: '#D4A038',
          border: '#E8C56A',
        },
        canvas: {
          bg: '#E5ECEF',
          surface: '#EEF3F5',
          border: '#D7E0E4',
        },
        primary: {
          DEFAULT: '#1B3636',
          50: '#F0F5F5',
          100: '#E0EBEA',
          500: '#203F3E',
          600: '#1B3636',
          700: '#142929',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        card: '0 2px 10px rgba(27, 54, 54, 0.05)',
        'card-hover': '0 8px 24px rgba(27, 54, 54, 0.08)',
        modal: '0 20px 40px rgba(20, 41, 41, 0.2)',
        gold: '0 4px 14px rgba(198, 146, 42, 0.35)',
      },
    },
  },
  plugins: [],
}
