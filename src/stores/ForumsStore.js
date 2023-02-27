import { defineStore } from 'pinia'
import { useThreadsStore } from './ThreadsStore'
import { findById, filterByValue, fetchItem, fetchItems } from '@/helpers'

export const useForumsStore = defineStore('ForumsStore', {
  state: () => {
    return {
      forums: []
    }
  },
  getters: {
    forumById () {
      return (id) => findById(this.forums, id)
    },
    threadsInForum () {
      return (id) => filterByValue(useThreadsStore().threads, 'forumId', id)
    }
  },
  actions: {
    async fetchForum (id) {
      return await fetchItem({ id, emoji: '🗣', resource: 'forums', store: this.forums })
    },
    async fetchForums (ids) {
      return await fetchItems({ ids, emoji: '🗣', resource: 'forums', store: this.forums })
    }
  }
})
