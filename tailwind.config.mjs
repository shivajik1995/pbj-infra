/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14171A',
        'ink-soft': '#2A2E32',
        paper: '#F6F3EC',
        'paper-dim': '#ECE7DA',
        stone: '#B9B2A2',
        accent: '#1E6E64',
        'accent-lt': '#DCEAE7',
        warn: '#B5501F',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        wrap: '1320px',
      },
    },
  },
  plugins: [],
};
