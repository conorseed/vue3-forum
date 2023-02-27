import { checkResourceExistsGuard, findById } from '@/helpers'
import { useCategoriesStore } from '../stores/CategoriesStore'
import { useForumsStore } from '../stores/ForumsStore'
import { useThreadsStore } from '../stores/ThreadsStore'
import { useUsersStore } from '../stores/UsersStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomeIndex')
  },
  {
    path: '/me',
    name: 'Profile',
    component: () => import('@/pages/ProfileShow.vue'),
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/profile/:id',
    name: 'ProfileOther',
    component: () => import('@/pages/ProfileShow.vue'),
    props: true,
    meta: { toTop: true, smoothScroll: true },
    async beforeEnter (to, from, next) {
      const redirect = await checkResourceExistsGuard(useUsersStore().users, 'users', '🧑', to)
      if (redirect) {
        next(redirect)
      } else {
        next()
      }
    }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: () => import('@/pages/ProfileShow.vue'),
    props: { edit: true },
    meta: { requiresAuth: true }
  },
  {
    path: '/category/:id',
    name: 'CategoryShow',
    component: () => import('@/pages/CategoryShow'),
    props: true,
    async beforeEnter (to, from, next) {
      const redirect = await checkResourceExistsGuard(useCategoriesStore().categories, 'categories', '🏷', to)
      if (redirect) {
        next(redirect)
      } else {
        next()
      }
    }
  },
  {
    path: '/forum/:id',
    name: 'ForumShow',
    component: () => import('@/pages/ForumShow'),
    props: true,
    async beforeEnter (to, from, next) {
      const redirect = await checkResourceExistsGuard(useForumsStore().forums, 'forums', '🗣', to)
      if (redirect) {
        next(redirect)
      } else {
        next()
      }
    }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: () => import('@/pages/ThreadCreate'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: () => import('@/pages/ThreadShow'),
    props: true,
    async beforeEnter (to, from, next) {
      const redirect = await checkResourceExistsGuard(useThreadsStore().threads, 'threads', '📄', to)
      if (redirect) {
        next(redirect)
      } else {
        next()
      }
    }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: () => import('@/pages/ThreadEdit'),
    props: true,
    // meta: { requiresAuth: true },
    async beforeEnter (to, from, next) {
      const threadsStore = useThreadsStore()

      const redirect = await checkResourceExistsGuard(threadsStore.threads, 'threads', '📄', to)
      if (redirect) return next(redirect)

      const thread = findById(threadsStore.threads, to.params.id)
      if (thread.userId !== useUsersStore().authId) {
        return next({
          name: 'ThreadShow',
          params: { id: to.params.id },
          query: to.query,
          hash: to.hash
        })
      }
      return next()
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterShow'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('@/pages/SignInShow'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signout',
    name: 'SignOut',
    async beforeEnter (to, from) {
      await useUsersStore().signOut()
      return { name: 'SignedOut' }
    }
  },
  {
    path: '/signedout',
    name: 'SignedOut',
    component: () => import('@/pages/SignedOutShow')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/pages/404NotFound')
  }
]

export default routes
