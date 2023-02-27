<template>
  <img v-if="user?.id" :class="`avatar-${props.size}`" :src="avatar" :alt="user.name">
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useUsersStore } from '@/stores/UsersStore'
const usersStore = useUsersStore()

const props = defineProps({
  size: { default: 'large', type: String, required: true },
  user: { type: Object }
})
const user = computed(() => {
  return props.user ? props.user : usersStore.authedUser
})
const avatar = computed(() => {
  return user.value?.avatar || 'https://images.placeholders.dev/?width=100&height=100&bgColor=%231f958f&textColor=%23ffffff&fontSize=40&text=' + user.value?.username.slice(0, 2).toUpperCase()
})
</script>

<style scoped>
 img{
  object-fit: cover
 }
</style>
