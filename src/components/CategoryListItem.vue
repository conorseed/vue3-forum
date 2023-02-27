<template>
  <div class="forum-list">
    <h2 class="list-title">
        <router-link v-if="props.link" :to="{name: 'CategoryShow', params:{id: category.id}}">{{ category.name }}</router-link>
        <span v-if="!props.link">Forums</span>
    </h2>
    <forum-list :forums="forums" />
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useCategoriesStore } from '@/stores/CategoriesStore'
import ForumList from './ForumList.vue'

const categoriesStore = useCategoriesStore()

const props = defineProps({
  category: {
    required: true,
    type: Object
  },
  link: {
    required: false,
    type: Boolean,
    default: false
  }
})

const forums = computed(() => {
  return categoriesStore.forumsWithCategory(props.category.id)
})
</script>

<style scoped>

</style>
