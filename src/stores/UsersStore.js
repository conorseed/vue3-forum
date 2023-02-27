import { defineStore } from 'pinia'
import { usePostsStore } from '@/stores/PostsStore'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { useFirebaseStore } from '@/stores/FirebaseStore'
import useNotifications from '@/composables/useNotifications'
import { findById, filterByValue, upsert, fetchItem, fetchItems, docToResource } from '@/helpers'
import firebase from '@/helpers/firebase'

export const useUsersStore = defineStore('UsersStore', {
  state: () => {
    return {
      users: [],
      authId: null
    }
  },
  getters: {
    userById () {
      return (id) => {
        const user = findById(this.users, id)
        // return null
        if (!user) return null
        // get stores
        const postsStore = usePostsStore()
        const threadsStore = useThreadsStore()

        // return data
        return {
          ...user,
          get posts () {
            return filterByValue(postsStore.posts, 'userId', user.id)
          },
          get postsCount () {
            return user.postsCount || 0
          },
          get threads () {
            return filterByValue(threadsStore.threads, 'userId', user.id)
          },
          get threadIds () {
            return user.threads
          },
          get threadsCount () {
            return user.threads?.length || 0
          }
        }
      }
    },
    authedUser () {
      const user = this.userById(this.authId)
      return user
    }
  },
  actions: {
    async fetchUser (payload) {
      return await fetchItem({ emoji: '🧑‍🦰', resource: 'users', store: this.users, ...payload })
    },
    async fetchUsers (payload) {
      return await fetchItems({ emoji: '🧑‍🦰', resource: 'users', store: this.users, ...payload })
    },
    async fetchAuthUser () {
      const userId = firebase.auth().currentUser?.uid
      if (!userId) return
      this.authId = userId
      return await fetchItem({
        id: this.authId,
        emoji: '🧑‍🦰',
        resource: 'users',
        store: this.users,
        handleUnsubscribe: (unsubscribe) => {
          useFirebaseStore().authUnsubscribe = unsubscribe
        }
      })
    },
    async updateUser (userToUpdate) {
      const updates = {
        avatar: userToUpdate.avatar || null,
        username: userToUpdate.username || null,
        name: userToUpdate.name || null,
        bio: userToUpdate.bio || null,
        website: userToUpdate.website || null,
        email: userToUpdate.email || null,
        location: userToUpdate.location || null
      }
      const userRef = firebase.firestore().collection('users').doc(userToUpdate.id)
      await userRef.update(updates)
      upsert(userToUpdate, this.users)
    },
    async updateEmail ({ email }) {
      return firebase.auth().currentUser.updateEmail(email)
    },
    async updatePassword ({ password }) {
      return firebase.auth().currentUser.updatePassword(password)
    },
    async createUser ({ id, email, name, username, avatar = null }) {
      const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()

      const user = { avatar, email, name, username, usernameLower, registeredAt }

      const userRef = await firebase.firestore().collection('users').doc(id)
      userRef.set(user)

      let newUser = await userRef.get()
      newUser = docToResource(newUser)
      upsert(newUser, this.users)
      return newUser
    },
    async registerUserWithEmailAndPassword ({ email, password, name, username, avatar = null }) {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password)

      avatar = this.uploadAvatar({ authId: result.user.uid, file: avatar })

      const user = await this.createUser({ id: result.user.uid, email, name, username, avatar })
      return user
    },
    async uploadAvatar ({ authId, file, filename }) {
      if (!file) return null
      authId = authId || this.authId
      filename = filename || file.name
      try {
        const storageBucket = firebase.storage().ref().child(`uploads/${authId}/images/${Date.now()}-${filename}`)
        const image = await storageBucket.put(file)
        const url = await image.ref.getDownloadURL()
        return url
      } catch (error) {
        const { addNotification } = useNotifications()
        addNotification({ message: 'Error uploading avatar image', type: 'error' })
      }
    },
    async signInWithEmailAndPassword ({ email, password }) {
      await firebase.auth().signInWithEmailAndPassword(email, password)
    },
    async signInWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      const response = await firebase.auth().signInWithPopup(provider)
      const user = response.user
      const userRef = firebase.firestore().collection('users').doc(user.uid)
      let userDoc = await userRef.get()
      if (!userDoc.exists) {
        userDoc = await this.createUser({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          username: user.email,
          avatar: user.photoURL
        })
      }
      return userDoc
    },
    async signOut () {
      await firebase.auth().signOut()
      this.authId = null
    },
    async initAuthentication () {
      const firebaseStore = useFirebaseStore()
      if (firebaseStore.authObservationUnsubscribe) firebaseStore.authObservationUnsubscribe()
      return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
          firebaseStore.unsubscribeAuthUser()
          if (user) {
            await this.fetchAuthUser()
            resolve(user)
          } else {
            resolve(null)
          }
        })
        firebaseStore.authObservationUnsubscribe = unsubscribe
      })
    },
    async reauthenticate ({ email, password }) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, password)
      await firebase.auth().currentUser.reauthenticateWithCredential(credential)
    }
  }
})
