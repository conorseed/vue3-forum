<template>
    <div class="flex-grid">
          <div class="col-3 push-top">

              <user-profile-card v-if="!edit" :user="user" />
              <user-profile-card-editor v-if="edit" :user="user" />

          </div>

          <div class="col-7 push-top">

              <div class="profile-header">
                  <span class="text-lead">
                    {{ user.username }}'s recent activity
                  </span>
              </div>

              <hr>

              <post-list :posts="user.posts" />
              <app-infinite-scroll
              @scroll:load="fetchUserPosts"
              :done="user.posts.length === user.postsCount"
              />
          </div>
      </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { storeToRefs } from 'pinia'
import PostList from '@/components/PostList.vue'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
import { useUsersStore } from '@/stores/UsersStore'
import { usePostsStore } from '@/stores/PostsStore'
import { useThreadsStore } from '@/stores/ThreadsStore'

defineProps({
  edit: { type: Boolean, default: false }
})
const usersStore = useUsersStore()

const { authedUser: user } = storeToRefs(usersStore)

const lastPostFetched = computed(() => {
  if (user.value.posts.length === 0) {
    return null
  }
  return user.value.posts[user.value.posts.length - 1]
})

const fetchUserPosts = async () => {
  return usePostsStore().fetchAuthUsersPosts({
    startAfter: lastPostFetched.value
  })
}

await fetchUserPosts()
await useThreadsStore().fetchAuthUsersThreads()

</script>

<style scoped>

</style>
