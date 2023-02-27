import { createPinia } from 'pinia'
import { createApp, markRaw } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import FontAwesome from '@/plugins/fontawesome'
import DirectiveClickOutside from '@/plugins/DirectiveClickOutside'
import DirectivePageScroll from '@/plugins/DirectivePageScroll'
import Vue3Pagination from '@/plugins/Vue3Pagination'
import VeeValidatePlugin from '@/plugins/VeeValidatePlugin'

/*
 * FIREBASE SHIT
 */
// Import the functions you need from the SDKs you need
import firebase from '@/helpers/firebase'
import firebaseConfig from '@/config/firebase.js'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

/*
 * VUE SETUP
 */
const app = createApp(App)
app.use(router)
app.use(FontAwesome)
app.use(DirectiveClickOutside)
app.use(DirectivePageScroll)
app.use(Vue3Pagination)
app.use(VeeValidatePlugin)

// PINIA
const pinia = createPinia()
pinia.use(({ store }) => { store.router = markRaw(router) })
app.use(pinia)

// register all base components
const baseComponents = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
baseComponents.keys().forEach((filename) => {
  let baseComponentConfig = baseComponents(filename)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    filename
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  app.component(baseComponentName, baseComponentConfig)
})

app.mount('#app')
