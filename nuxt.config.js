// https://nuxt.com/docs/api/configuration/nuxt-config
/* global defineNuxtConfig */
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    ['@pinia/nuxt', { autoImports: ['defineStore'] }]
  ],
  css: [
    'element-plus/dist/index.css',
    'element-plus/theme-chalk/dark/css-vars.css',
    '@/assets/style/main.css'
  ],
  ssr: false
})
