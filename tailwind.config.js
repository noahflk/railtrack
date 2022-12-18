module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '475px',
      },
      colors: {
        primary: '#902D41',
        'primary-light': '#AB3F55',
        'primary-dark': '#8D1C33',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
