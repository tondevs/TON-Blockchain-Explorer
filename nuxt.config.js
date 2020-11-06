const webpack = require('webpack')

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'TON Blockchain Explorer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    // script: [
    //   {
    //     src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js'
    //   }
    // ],
    link: [
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/fav/favicon.ico' },
      { rel: 'icon', type: 'image/x-icon', href: '/fav/favicon.ico' },
      { rel: 'icon', type: 'image/gif', href: '/fav/favicon.gif' },
      { rel: 'icon', type: 'image/png', href: '/fav/favicon.png' },
      { rel: 'icon', type: 'image/png', href: '/fav/favicon-16x16.png', sizes: '16x16' },
      { rel: 'icon', type: 'image/png', href: '/fav/favicon-32x32.png', sizes: '32x32' },
      { rel: 'icon', type: 'image/png', href: '/fav/favicon-96x96.png', sizes: '96x96' },
      { rel: 'icon', type: 'image/png', href: '/fav/favicon-160x160.png', sizes: '160x160' },
      { rel: 'icon', type: 'image/png', href: '/fav/favicon-192x192.png', sizes: '192x192' },
      { rel: 'icon', type: 'image/png', href: '/fav/favicon-196x196.png', sizes: '196x196' },
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss',
    '~node_modules/@fortawesome/fontawesome-free/scss/regular.scss',
    '~node_modules/@fortawesome/fontawesome-free/scss/solid.scss',
    '~node_modules/bootstrap/scss/bootstrap.scss',
    '~assets/scss/dark.scss',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    // your settings here
    scss: [],
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-i18n',
  ],

  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: require('./locale/en/app.json'),
        ko: require('./locale/ko/app.json'),
      }
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  }
}
