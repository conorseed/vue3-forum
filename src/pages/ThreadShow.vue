<template>
  <div class="col-large push-top">

    <h1>
      {{ thread.title }}
      <router-link
      v-if="thread.userId === usersStore.authId"
      :to="{name: 'ThreadEdit', params:{id}}"
      class="btn-green btn-small"
      tag="button"
      >
      Edit Thread
    </router-link>
    </h1>
    <p>
        By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a>, <app-date :timestamp="thread.publishedAt || NaN" />
        <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">
          {{ thread.repliesCount }} {{ thread.repliesCount == 1 ? 'reply' : 'replies'  }} by {{ thread.contributorsCount }} {{ thread.contributorsCount == 1 ? 'contributor' : 'contributors' }}
        </span>
    </p>

    <post-list :posts="threadPosts" />

    <post-editor v-if="usersStore.authedUser" @PostEditor:Save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to="{name: 'SignIn', query: {redirect: route.path}}">Sign In</router-link> or <router-link :to="{name: 'Register', query: {redirect: route.path}}">Register</router-link> to join the conversation.
    </div>

</div>
</template>

<script setup>
import { computed, defineProps, ref, onMounted } from 'vue'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor.vue'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { usePostsStore } from '@/stores/PostsStore'
import { useUsersStore } from '@/stores/UsersStore'
import { useRoute } from 'vue-router'
import useNotifications from '@/composables/useNotifications'
import difference from 'lodash/difference'

const route = useRoute()
const threadsStore = useThreadsStore()
const postsStore = usePostsStore()
const usersStore = useUsersStore()
const { addNotification } = useNotifications()

const props = defineProps({
  id: {
    required: true,
    type: String
  }
})

/* FIREBASE CRAP */
const loading = ref(true)
try {
  const threadFetch = await threadsStore.fetchThread({
    id: props.id,
    onSnapshot: ({ isLocal, item, previousItem }) => {
      if (loading.value || isLocal) {
        return
      }
      const newPostIds = difference(item.posts, previousItem.posts)
      const hasNewPosts = newPostIds.length > 0
      if (hasNewPosts) {
        fetchPostsWithUsers(newPostIds)
        return
      }
      addNotification({ message: 'Thread recently updated', timeout: 6000 })
    }
  })

  // get user
  usersStore.fetchUser(threadFetch.userId)

  // get posts
  await fetchPostsWithUsers(threadFetch.posts)
} catch (error) {
  console.error(error)
}

async function fetchPostsWithUsers (ids) {
  const posts = await postsStore.fetchPosts({
    ids,
    onSnapshot: ({ isLocal, previousItem }) => {
      if (loading.value || isLocal || (previousItem?.edited && !previousItem?.edited?.at)) {
        return
      }
      addNotification({ message: 'Thread recently updated', timeout: 6000 })
    }
  })
  const users = posts.length ? posts.map(post => post.userId) : []
  await usersStore.fetchUsers({ ids: users })
}

/* THREAD DATA */
const thread = computed(() => {
  return threadsStore.threadById(props.id)
})
const threadPosts = computed(() => {
  return threadsStore.postsInThread(props.id)
})

/* NEW POST */
function addPost (payload) {
  const post = {
    ...payload,
    threadId: props.id
  }
  // add post data
  postsStore.createPost(post)
}

onMounted(() => {
  loading.value = false
})

</script>

<style scoped>

</style>
