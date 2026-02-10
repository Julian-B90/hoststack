/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0d12',
        sand: '#f5f2ea',
        fog: '#e4e2dc',
        ember: '#ff7a45',
        moss: '#0f7b6c',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'ui-sans-serif', 'system-ui'],
        body: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 10px 30px -20px rgba(11, 13, 18, 0.6)',
      },
    },
  },
  plugins: [],
};
