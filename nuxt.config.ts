import postcss from './postcss.config';
import pkg from './package.json' assert { type: 'json' };

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Bao B2B',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css',
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
  content: {
  },
  runtimeConfig: {
    public: {
      version: pkg.version,
      r2Domain: process.env.R2_DOMAIN,
    },
  },
  postcss,
  routeRules: {
    // pre-rendered at build time
    '/': { prerender: true },
    '/about': { prerender: true },
    '/contact': { prerender: true },
    // pages generated on-demand, revalidates in background
    '/product/**': { swr: true },
    '/category/**': { swr: true },
    // Admin dashboard renders only on client-side
    '/admin/**': { ssr: false },
    // Add cors headers on API routes
    '/api/**': { cors: true },
  },
});
