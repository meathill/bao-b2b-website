import themes from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      spacing: {
        '13-2': '3.3rem',
        15: '3.75rem',
        '17-6': '4.4rem',
        21: '5.25rem',
        '22-5': '5.625rem',
        120: '30rem',
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: ['corporate'],
    darkMode: 'business',
  },
}
