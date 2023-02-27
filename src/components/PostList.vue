<template>
  <div class="post-list">

        <div v-for="post in posts" :key="post.id" class="post">

            <div v-if="usersStore.userById(post.userId)" class="user-info">
                <router-link :to="{name:'ProfileOther', params:{id: usersStore.userById(post.userId)?.id}}" class="user-name">{{ usersStore.userById(post.userId).name }}</router-link>

                <router-link :to="{name:'ProfileOther', params:{id: usersStore.userById(post.userId)?.id}}">
                    <app-user-avatar size="large" :user="usersStore.userById(post.userId)" />
                </router-link>

                <p class="desktop-only text-small">{{usersStore.userById(post.userId).postsCount}} post{{usersStore.userById(post.userId).postsCount === 1 ? '' : 's'}}</p>
                <p class="desktop-only text-small">{{usersStore.userById(post.userId).threadsCount}} thread{{usersStore.userById(post.userId).threadsCount === 1 ? '' : 's'}}</p>

            </div>

            <div class="post-content">
                <div>
                  <post-editor
                  v-if="editing == post.id" :post="post"
                  @PostEditor:Save="updatePost"
                  @PostEditor:Cancel="toggleEditMode($event.id)" />
                  <p v-else>
                    {{ post.text }}
                  </p>
                </div>
                <a
                v-if="post.userId === usersStore.authId"
                @click.prevent="toggleEditMode(post.id)"
                href="#"
                style="margin-left: auto;padding-left: 10px"
                class="link-unstyled"
                title="Make a change">
                  <font-awesome-icon icon="fa-solid fa-pencil" />
                </a>
            </div>

            <div class="post-date text-faded">
              <div v-if="post.edited?.at" class="edition-info">edited</div>
              <app-date :timestamp="post.publishedAt" />
            </div>

        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { useUsersStore } from '@/stores/UsersStore'
import { usePostsStore } from '@/stores/PostsStore'
import PostEditor from '@/components/PostEditor'

const usersStore = useUsersStore()
const postsStore = usePostsStore()

defineProps({
  posts: {
    required: true,
    type: Array
  }
})

const editing = ref(null)

function toggleEditMode (id) {
  editing.value = id === editing.value ? null : id
}

function updatePost (post) {
  postsStore.updatePost(post)
  toggleEditMode(post.id)
}

</script>

<style scoped>

</style>
