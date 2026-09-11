/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#101826',
          light: '#1B2536',
        },
        blueprint: {
          DEFAULT: '#1E3A5F',
          light: '#2C5282',
        },
        paper: '#EEF1F4',
        amber: {
          DEFAULT: '#E8A33D',
          dark: '#C9822A',
        },
        status: {
          operational: '#3F8C5F',
          maintenance: '#E8A33D',
          damaged: '#C0483C',
          decommissioned: '#8A93A0',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
