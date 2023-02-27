import { defineStore } from 'pinia'

export const useFirebaseStore = defineStore('FirebaseStore', {
  state: () => {
    return {
      unsubscribes: [],
      authUnsubscribe: null,
      authObservationUnsubscribe: null
    }
  },
  getters: {},
  actions: {
    appendUnsubscribe (unsubscribe) {
      this.unsubscribes.push(unsubscribe)
    },
    clearAllUnsubscribes () {
      this.unsubscribes = []
    },
    async unsubscribeAll () {
      this.unsubscribes.forEach(unsubscribe => unsubscribe())
      this.clearAllUnsubscribes()
    },
    async unsubscribeAuthUser () {
      if (this.authUnsubscribe) {
        this.authUnsubscribe()
      }
      this.authUnsubscribe = null
    }
  }
})
