import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import { useFirebaseStore } from '../stores/FirebaseStore'
import { useUsersStore } from '../stores/UsersStore'
import { useForumsStore } from '../stores/ForumsStore'
import { useCategoriesStore } from '../stores/CategoriesStore'
import { useThreadsStore } from '../stores/ThreadsStore'
import { usePostsStore } from '../stores/PostsStore'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})

router.beforeEach(async (to) => {
  const usersStore = useUsersStore()
  // check if user changed
  await usersStore.initAuthentication()

  // unsubscribe snapshots
  useFirebaseStore().unsubscribeAll()

  // if not logged in
  if (to.meta.requiresAuth && !usersStore.authId) {
    return { name: 'SignIn', query: { redirect: to.path } }
  }

  // if logged in
  if (to.meta.requiresGuest && usersStore.authId) {
    return { name: 'Home' }
  }
})

router.afterEach(() => {
  useForumsStore().forums = []
  useCategoriesStore().categories = []
  useThreadsStore().threads = []
  usePostsStore().posts = []
})

export default router
