// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  components: true,

  runtimeConfig: {
    public: {
      apiServerBaseUrl: process.env.API_SERVER_BASE_URL || 'http://localhost:8080'
    },
  },


  vite: {
    server: {
      strictPort: false,
      allowedHosts: ['.drtau.me', '.cloudpub.ru'],
    },
    build: {
      target: 'es2022'
    }
  },

  app: {
    head: {
      script: [{ src: 'https://telegram.org/js/telegram-web-app.js' }],
    },
  },

  modules: [
    '@nuxt/test-utils',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
  ]
})