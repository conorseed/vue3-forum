import { createPinia } from 'pinia'
import { createApp, markRaw } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import FontAwesome from '@/plugins/fontawesome'
import DirectiveClickOutside from '@/plugins/DirectiveClickOutside'
import DirectivePageScroll from '@/plugins/DirectivePageScroll'
import Vue3Pagination from '@/plugins/Vue3Pagination'
import VeeValidatePlugin from '@/plugins/VeeValidatePlugin'
import { createHead } from '@vueuse/head'
import { upperFirst, camelCase } from 'lodash'

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

const head = createHead()
app.use(head)

// PINIA
const pinia = createPinia()
pinia.use(({ store }) => { store.router = markRaw(router) })
app.use(pinia)

// register all base components
const componentFiles = import.meta.globEager(
  '@/components/App*.vue'
);
Object.entries(componentFiles).forEach(([path, m]) => {
  const componentName = upperFirst(
    camelCase(path.split('/').pop().replace(/\.\w+$/, ''))
  );

  app.component(
    `${componentName}`, m.default
  );
})

app.mount('#app')
