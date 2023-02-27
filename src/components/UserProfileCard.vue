<template>
  <div class="profile-card">

    <p class="text-center">
        <app-user-avatar size="xlarge" />
    </p>

    <h1 class="title">{{ user.username }}</h1>

    <p class="text-lead">{{ user.name }}</p>

    <p class="text-justify">
        {{ user.bio || 'No bio specified.' }}
    </p>

    <span class="online">{{ user.username }} is online</span>

    <div class="stats">
        <span>{{ user.postsCount }} post{{ (user.postsCount === 1) ? '' : 's' }}</span>
        <span>{{ user.threadsCount }} thread{{ (user.threadsCount === 1) ? '' : 's' }}</span>
    </div>

    <hr>

    <p v-if="user.website" class="text-large text-center">
      <i class="fa fa-globe"></i>
      <a :href="user.website" target="_blank">{{ user.website }}</a>
    </p>

  </div>
  <div class="text-center">
    <router-link :to="{name: 'ProfileEdit'}" class="btn-green btn-small">Edit Profile</router-link>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  user: {
    type: Object,
    required: true
  }
})

</script>

<style scoped>

</style>
