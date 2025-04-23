// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  components: true,

  runtimeConfig: {
    public: {
      API_SERVER_BASE_URL: 'https://localhost:7237',
    },
  },


  vite: {
    server: {
      strictPort: false,
      allowedHosts: ['.cloudpub.ru'],
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