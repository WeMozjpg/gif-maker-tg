/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: '#D4AF37',
          platinum: '#E5E4E2',
          darkGold: '#B8860B',
          lightGold: '#F7E98E',
          charcoal: '#36454F',
          pearl: '#F8F6F0',
          bronze: '#CD7F32',
          silver: '#C0C0C0',
        },
        primary: {
          50: '#fdf8f0',
          100: '#fbefd9',
          200: '#f6ddb3',
          300: '#f0c583',
          400: '#e7a451',
          500: '#e0892b',
          600: '#d17320',
          700: '#ae591c',
          800: '#8c471e',
          900: '#723c1c',
        },
      },
      fontFamily: {
        luxury: ['Playfair Display', 'serif'],
        elegant: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)' },
        },
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
        'gradient-pearl': 'linear-gradient(135deg, #F8F6F0 0%, #E5E4E2 100%)',
        'gradient-charcoal': 'linear-gradient(135deg, #36454F 0%, #2C3E50 100%)',
      },
      boxShadow: {
        'luxury': '0 10px 25px rgba(212, 175, 55, 0.15)',
        'luxury-lg': '0 20px 40px rgba(212, 175, 55, 0.2)',
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'elegant-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}