/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx}',
  ],
  // Lift/button animacijos – visada įtraukti (dynamic class string JIT kartais nepagauna)
  safelist: [
    'transition-all', 'duration-300', 'duration-200', 'ease-out',
    'hover:-translate-y-2', 'hover:scale-[1.04]', 'hover:shadow-xl', 'hover:z-20',
    'hover:scale-[1.02]',
    'focus-visible:-translate-y-2', 'focus-visible:scale-[1.04]', 'focus-visible:shadow-xl', 'focus-visible:z-20', 'focus-visible:outline-none',
    'focus-visible:ring-2', 'focus-visible:ring-graphite', 'focus-visible:ring-offset-2',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        graphite: 'var(--graphite)',
        mocha: 'var(--mocha)',
        stylesDark: '#383737',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

