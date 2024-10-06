export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
    'shadcn-nuxt',
    'nuxt-icon',
    '@nuxtjs/color-mode'
  ],
  
  future: {
    compatibilityVersion: 4,
  },

  shadcn: {
    componentDir: './app/components/ui'
  },
  colorMode: {
    classSuffix: ''
  },
  ssr: false,

  experimental:{
    viewTransition: true
  },

  imports: {
    presets: [
      {
        from: 'notiwind',
        imports: ['notify']
      }
    ]
  },
  vite: {
    define: { global: 'window' },
    optimizeDeps: {
      exclude: ['vee-validate']
    }
    },
  googleFonts: {
    families: {
      'Montserrat': [100,200,300,400,500,600,700,800,900],
    }
  },

  app:{
      head:{
        title: 'OSData.space',
          meta: [
              { charset: 'utf-8' },
              { name: 'viewport', content: 'width=device-width, initial-scale=1' },
              { hid: 'description', name: 'description', content: 'Visualize OSDR with AI' },
              { name: 'format-detection', content: 'telephone=no' }
          ],
          link: [
              // { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
              { rel: 'icon', type: 'image/x-icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 110 110%22><text y=%22.9em%22 font-size=%2290%22>🔬</text></svg>' },
            ]
          },
      pageTransition: false,
      layoutTransition: false
  },

  compatibilityDate: '2024-07-13'
})