<template>
  <div v-if="forum" class="col-full push-top">

    <h1>Create new thread in <i>{{ forum.name }}</i></h1>

    <thread-editor @save="save" @cancel="cancel" @dirty="formIsDirty = true" @clean="formIsDirty = false" />
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import ThreadEditor from '@/components/ThreadEditor.vue'
import { useForumsStore } from '@/stores/ForumsStore'
import { useThreadsStore } from '@/stores/ThreadsStore'

const props = defineProps({
  forumId: { type: String, required: true }
})
const router = useRouter()
const threadsStore = useThreadsStore()
const forumsStore = useForumsStore()

await forumsStore.fetchForum(props.forumId)

const forum = computed(() => {
  return forumsStore.forumById(props.forumId)
})

async function save ({ title, text }) {
  const newThread = await threadsStore.createThread(title, text, props.forumId)
  router.push({ name: 'ThreadShow', params: { id: newThread.id } })
}

function cancel () {
  router.push({ name: 'ForumShow', params: { id: props.forumId } })
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
