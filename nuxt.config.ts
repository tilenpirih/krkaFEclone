import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  css: ['@/assets/css/main.scss'],
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL || 'http://localhost:8001',
      KZS_API: process.env.KZS_API,
      BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
  app: {
    head: {
      title: 'Socialna omrežja',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'title', content: 'Socialna omrežja' },
        { name: 'description', content: 'Generiranje slik za socialna omrežja.' },
        { property: 'og:image', content: `${process.env.BASE_URL}/img/logo.png` },
        { property: 'og:title', content: 'Socialna omrežja' },
        { property: 'og:description', content: 'Generiranje slik za socialna omrežja.' },
        { property: 'og:url', content: `${process.env.BASE_URL}/socialna-omrežja` },
      ],
    },
  },
  modules: [
    '@pinia/nuxt',
    'dayjs-nuxt',
    '@nuxt/fonts',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  fonts: {
    families: [
      { name: 'Poppins', provider: 'google', preload: true, global: true },
      // { name: 'Tomarik Brush', src: '/assets/fonts/Tomarik-Brush.woff2', preload: true, global: true },

    ],
  },
  dayjs: {
    locales: ['sl'],
    defaultLocale: 'sl',
    plugins: [
      'utc',
      'timezone',
    ],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  routeRules: {
    '/*': { ssr: false },
  },
  nitro: {
    preset: 'bun'
  },
})
