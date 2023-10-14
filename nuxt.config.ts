import pkg from './package.json' assert { type: 'json' };

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Bao B2B',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/bootstrap-icons@1.11.1/font/bootstrap-icons.css',
        },
      ],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, user-scalable=no',
        },
      ],
    },
  },
  css: [
    '~/assets/css/main.css',
  ],
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore'],
      },
    ],
  ],
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  routeRules: {
    // pre-rendered at build time
    '/': { prerender: true },
    '/about': { prerender: true },
    '/contact': { prerender: true },
    // pages generated on-demand, revalidates in background
    ...process.env.NODE_ENV === 'production' && {
      '/product/**': { isr: true },
      '/category/**': { isr: true },
    },
    '/rfq': { ssr: false },
    // Admin dashboard renders only on client-side
    '/admin/**': { ssr: false },
    // Add cors headers on API routes
    '/api/**': { cors: true },
  },
  vite: {
    define: {
      __VERSION__: JSON.stringify(pkg.version),
      __R2_DOMAIN__: JSON.stringify(process.env.R2_DOMAIN),
    },
  },
});
