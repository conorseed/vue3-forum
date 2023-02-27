<template>
  <section class="col-full">
    <h1 class="push-top">Welcome to the forum</h1>
    <div class="col-full">
      <category-list-item v-for="category in categoriesStore.categories" :key="category.id" :category="category" :link="true" />
    </div>
  </section>
</template>

<script setup>
import CategoryListItem from '@/components/CategoryListItem'
import { useCategoriesStore } from '@/stores/CategoriesStore'
import { useForumsStore } from '@/stores/ForumsStore'

const categoriesStore = useCategoriesStore()
const forumsStore = useForumsStore()

try {
  const categories = await categoriesStore.fetchAllCategories()
  const forumIds = categories.map(category => category.forums).flat()
  await forumsStore.fetchForums(forumIds)
} catch (error) {
  console.error(error)
}

</script>

<style scoped>

</style>
