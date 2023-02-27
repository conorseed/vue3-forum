<template>
      <div v-for="forum in forums" :key="forum.id" class="forum-listing">
          <div class="forum-details">
              <router-link
              :to="{ name: 'ForumShow', params: {id: forum.id} }"
              class="text-xlarge">
                {{ forum.name }}
              </router-link>
              <p>{{ forum.description }}</p>
          </div>
          <div class="threads-count">
              <p>
                <span class="count">{{ forum.threads?.length ? forum.threads.length : 0 }}</span>
                {{ forum.threads?.length == 1 ? 'thread' : 'threads' }}
              </p>
          </div>
          <div class="last-thread"></div>
      </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  forums: {
    required: true,
    type: Array
  }
})
</script>

<style scoped>

</style>
