<template>
  <the-navbar />
  <div class="container">
    <RouterView v-slot="{ Component }" :key="useRoute().fullPath">
      <template v-if="Component">
        <Transition mode="out-in">
          <Suspense @resolve="pageReady">
              <!-- main content -->
              <component :is="Component"></component>

              <!-- loading state -->
              <template #fallback>
                <app-spinner />
              </template>
          </Suspense>
        </Transition>
      </template>
    </RouterView>
  </div>
  <app-notifications />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import { useUsersStore } from '@/stores/UsersStore'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useHead } from '@unhead/vue'

const usersStore = useUsersStore()
usersStore.fetchAuthUser()

NProgress.configure({
  speed: 200,
  showSpinner: false
})

useRouter().beforeEach(() => {
  NProgress.start()
})

function pageReady () {
  NProgress.done()
}

useHead({
  meta: [
    { name: 'description', content: 'A Vue3 Forum SPA written with the composition API and Firebase 🔥' },

    {property: "og:title", content: "Vue3 Masterclass Forum"},
    {property: "og:description", content: "A Vue3 Forum SPA written with the composition API and Firebase 🔥"},
    {property: "og:image", content: "https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg"},

    {name: "twitter:title", content: "Vue3 Masterclass Forum"},
    {name: "twitter:description", content: "A Vue3 Forum SPA written with the composition API and Firebase 🔥"},
    {name: "twitter:image", content: "https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg"},
    {name: "twitter:card", content: "summary_large_image"},
  ]
})
</script>

<style>
@import "assets/style.css";
@import "nprogress/nprogress.css";
#nprogress .bar{
  background: #57AD8D !important
}
</style>
