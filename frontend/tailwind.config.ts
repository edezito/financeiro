// tailwind.config.js
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
        background: 'hsl(0, 0%, 6%)',
        foreground: 'hsl(0, 0%, 96%)',
        card: 'hsl(0, 0%, 10%)',
        'card-foreground': 'hsl(0, 0%, 96%)',
        muted: 'hsl(0, 0%, 14%)',
        'muted-foreground': 'hsl(0, 0%, 45%)',
        accent: 'hsl(0, 0%, 17%)',
        'accent-foreground': 'hsl(0, 0%, 96%)',
        destructive: 'hsl(0, 73%, 71%)',
        success: 'hsl(160, 60%, 52%)',
        interactive: 'hsl(217, 92%, 68%)',
        border: 'hsl(0, 0%, 17%)',
      },
      fontFamily: {
        display: ['Roboto Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'pulse-caixa': {
          '0%, 100%': { boxShadow: 'none' },
          '50%': { boxShadow: 'inset 0 0 30px -10px hsl(217 92% 68% / 0.15)' },
        },
        'pulse-ativos': {
          '0%, 100%': { boxShadow: 'none' },
          '50%': { boxShadow: 'inset 0 0 30px -10px hsl(160 60% 52% / 0.15)' },
        },
      },
      animation: {
        'pulse-caixa': 'pulse-caixa 200ms ease-out',
        'pulse-ativos': 'pulse-ativos 200ms ease-out',
      },
    },
  },
  plugins: [],
}