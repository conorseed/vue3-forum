<template>
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <div v-if="threads.length" class="thread-list">
        <div v-for="thread in threads" :key="thread.id" class="thread">
          <div v-if="usersStore.userById(thread.userId)">
              <p>
                  <router-link :to="{name: 'ThreadShow', params: {id: thread.id}}">{{ thread.title }}</router-link>
              </p>
              <p class="text-faded text-xsmall">
                  By <router-link :to="{}">{{ usersStore.userById(thread.userId).name }}</router-link>, <app-date :timestamp="thread.publishedAt" />.
              </p>
          </div>
          <div v-if="usersStore.userById(thread.userId)" class="activity">
              <p class="replies-count">
                  {{thread.repliesCount}} replies
              </p>
              <app-user-avatar size="medium" :user="usersStore.userById(thread.userId)" />
              <div>
                  <p class="text-xsmall">
                    <router-link :to="{}">{{ usersStore.userById(thread.userId).name }}</router-link>
                  </p>
                  <p class="text-xsmall text-faded"><app-date :timestamp="thread.publishedAt" /></p>
              </div>
          </div>
        </div>
      </div>
      <div v-else>
        <em class="thread">Be the first to create a thread!</em>
      </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useUsersStore } from '@/stores/UsersStore'

const usersStore = useUsersStore()
usersStore.fetchUser(usersStore.authId)

const props = defineProps({
  threads: {
    type: Array,
    required: true
  }
})

</script>

<style scoped>

</style>
