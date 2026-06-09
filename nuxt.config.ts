// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'ClinicMS',
      defaultTenant: process.env.NUXT_PUBLIC_DEFAULT_TENANT || 'default',
    },
  },

  app: {
    head: {
      title: 'ClinicMS - Clinic Management System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Multi-tenant Clinic Management System' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  imports: {
    dirs: ['stores', 'composables', 'utils'],
  },

  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://purple-monkey-669831.hostingersite.com',
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: ['chart.js'],
    },
  },
})
