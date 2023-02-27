<template>
  <div v-if="thread" class="col-full push-top">

    <h1>Editing <i>{{ thread.title }}</i></h1>

    <thread-editor :title="thread.title" :text="text" @save="save" @cancel="cancel" @dirty="formIsDirty = true" @clean="formIsDirty = false" />
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { usePostsStore } from '@/stores/PostsStore'
import ThreadEditor from '@/components/ThreadEditor.vue'
import { findById } from '@/helpers'

const props = defineProps({
  id: { type: String, required: true }
})
const router = useRouter()
const threadsStore = useThreadsStore()
const postsStore = usePostsStore()

const threadFetch = await threadsStore.fetchThread({ id: props.id })
await postsStore.fetchPost({ id: threadFetch.posts[0] })

const thread = computed(() => {
  return findById(threadsStore.threads, props.id)
})
const text = computed(() => {
  const post = findById(postsStore.posts, thread.value.posts[0])
  return (post) ? post.text : ''
})

async function save ({ title, text }) {
  await threadsStore.updateThread(title, text, props.id)
  router.push({ name: 'ThreadShow', params: { id: props.id } })
}

function cancel () {
  router.push({ name: 'ThreadShow', params: { id: props.id } })
}

const formIsDirty = ref(false)

onBeforeRouteLeave(() => {
  if (formIsDirty.value) {
    const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost!')
    if (!confirmed) return false
  }
})

</script>

<style scoped>

</style>
