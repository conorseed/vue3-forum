import { defineStore } from 'pinia'
import { useForumsStore } from './ForumsStore'
import { findById, filterByValue, upsert, fetchItem, fetchItems, docToResource } from '@/helpers'
import firebase from '@/helpers/firebase'

export const useCategoriesStore = defineStore('CategoriesStore', {
  state: () => {
    return {
      categories: []
    }
  },
  getters: {
    categoryById () {
      return (id) => findById(this.categories, id)
    },
    forumsWithCategory () {
      return (id) => filterByValue(useForumsStore().forums, 'categoryId', id)
    }
  },
  actions: {
    async fetchAllCategories () {
      return new Promise(resolve => {
        firebase.firestore().collection('categories').onSnapshot(querySnapshot => {
          const categories = querySnapshot.docs.map(doc => {
            const category = docToResource(doc)
            upsert(category, this.categories)
            return category
          })
          resolve(categories)
        })
      })
    },
    async fetchCategory (id) {
      return await fetchItem({ id, emoji: '🗣', resource: 'categories', store: this.categories })
    },
    async fetchcategories (ids) {
      return await fetchItems({ ids, emoji: '🗣', resource: 'categories', store: this.categories })
    }
  }
})
