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

import { defineProps, computed, ref } from 'vue'
import CategoryListItem from '@/components/CategoryListItem.vue'
import { useCategoriesStore } from '@/stores/CategoriesStore'
import { useForumsStore } from '../stores/ForumsStore'
import { useHead } from '@unhead/vue'

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

const title = ref(`${category.value?.name} | Vue3 Masterclass Forum`)
useHead({
  title: () => title.value,
  meta: [
  {property: "og:title", content: () => title.value},
  {name: "twitter:title", content: () => title.value}
   ]
})
</script>

<style scoped>

</style>
