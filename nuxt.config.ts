// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  vite: {
    server: {
      strictPort: false,
      allowedHosts: ['.ngrok-free.app']
    }
  },

  modules: [
    '@nuxt/test-utils',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
  ]
})