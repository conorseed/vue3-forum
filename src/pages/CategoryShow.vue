<template>
  <div class="col-full">
    <div class="forum-header">
        <div class="forum-details">
            <h1>{{ category.name }}</h1>
        </div>
    </div>
    <category-list-item :category="category" />
  </div>
</template>

<script setup>

import { defineProps, computed } from 'vue'
import CategoryListItem from '@/components/CategoryListItem.vue'
import { useCategoriesStore } from '@/stores/CategoriesStore'
import { useForumsStore } from '../stores/ForumsStore'

const categoriesStore = useCategoriesStore()

const props = defineProps({
  id: {
    required: true,
    type: String
  }
})

try {
  const categoryFetch = await categoriesStore.fetchCategory(props.id)
  await useForumsStore().fetchForums(categoryFetch.forums)
} catch (error) {
  console.warn(error)
}

const category = computed(() => {
  return categoriesStore.categoryById(props.id)
})

</script>

<style scoped>

</style>
