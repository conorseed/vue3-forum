<template>
  <div class="col-full">
    <div class="col-full push-top">
        <div class="forum-header">
            <div class="forum-details">
                <h1>{{ forum.name }}</h1>
                <p class="text-lead">{{ forum.description }}</p>
            </div>
            <router-link
            :to="{name: 'ThreadCreate', params: {forumId: forum.id}}"
            class="btn-green btn-small"
            >Start a thread</router-link>
        </div>
    </div>
    <div class="col-full push-top">
        <thread-list :threads="threads" />
        <v-pagination
          v-model="page"
          :pages="totalPages"
          active-color="#57AD8D"

        />
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, watch } from 'vue'
import ThreadList from '@/components/ThreadList.vue'
import { useForumsStore } from '@/stores/ForumsStore'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { useUsersStore } from '@/stores/UsersStore'
import { useRoute, useRouter } from 'vue-router'

const forumsStore = useForumsStore()
const threadsStore = useThreadsStore()

const router = useRouter()
const route = useRoute()

const props = defineProps({
  id: {
    required: true,
    type: String
  }
})

const page = ref(parseInt(route.query.page) || 1)
const perPage = 10
const threadCount = computed(() => {
  return forum.value.threads?.length || 0
})
const totalPages = computed(() => {
  if (!threadCount.value) return 0
  return Math.ceil(threadCount.value / perPage)
})

try {
  const forumFetch = await forumsStore.fetchForum(props.id)
  const threadsFetch = await fetchThreadsByPage(forumFetch)
  await fetchUsers(threadsFetch)
} catch (e) {
  console.error(e)
}

const forum = computed(() => {
  return forumsStore.forumById(props.id)
})

const threads = computed(() => {
  if (!forum.value.threads) return []
  const threads = threadsStore.threads
    .filter(thread => thread.forumId === forum.value.id)
  return threads
})

watch(page, async () => {
  router.push({ query: { page: page.value } })
})

async function fetchThreadsByPage (forum) {
  return await threadsStore.fetchThreadsByPage(forum.threads, page.value, perPage)
}
async function fetchUsers (threads) {
  const userIds = threads.length ? threads.map(t => t.userId) : []
  await useUsersStore().fetchUsers({ ids: userIds })
}
</script>

<style scoped>

</style>
