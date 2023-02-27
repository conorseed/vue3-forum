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
</script>

<style>
@import "assets/style.css";
@import "~nprogress/nprogress.css";
#nprogress .bar{
  background: #57AD8D !important
}
</style>
