/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        heading: ['"Nunito"', 'system-ui', 'sans-serif'],
        body: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          red:    '#e8282a',
          redDark:'#c0181a',
          yellow: '#fbbf01',
          dark:   '#1a0a00',
          cream:  '#fff8ee',
          gray:   '#f5f5f5',
        },
      },
      animation: {
        'slide-in':    'slideIn 0.32s cubic-bezier(.22,1,.36,1)',
        'fade-up':     'fadeUp 0.4s ease-out both',
        'pop':         'pop 0.25s ease-out',
        'badge-pulse': 'badgePulse 1.4s ease-in-out infinite',
        'shimmer':     'shimmer 1.6s linear infinite',
      },
      keyframes: {
        slideIn:    { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        fadeUp:     { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pop:        { '0%,100%': { transform:'scale(1)' }, '50%': { transform:'scale(1.12)' } },
        badgePulse: { '0%,100%': { transform:'scale(1)' }, '50%': { transform:'scale(1.2)' } },
        shimmer:    { from:{ backgroundPosition:'-200% 0' }, to:{ backgroundPosition:'200% 0' } },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
