import { defineStore } from 'pinia'
import { useThreadsStore } from './ThreadsStore'
import { useUsersStore } from './UsersStore'
import { fetchItem, fetchItems, docToResource, upsert } from '@/helpers'
import firebase from '@/helpers/firebase'

export const usePostsStore = defineStore('PostsStore', {
  state: () => {
    return {
      posts: []
    }
  },
  getters: {},
  actions: {
    async fetchPost (payload) {
      return await fetchItem({ emoji: '💬', resource: 'posts', store: this.posts, ...payload })
    },
    async fetchPosts (payload) {
      return await fetchItems({ emoji: '💬', resource: 'posts', store: this.posts, ...payload })
    },
    async fetchAuthUsersPosts ({ startAfter }) {
      let query = await firebase.firestore()
        .collection('posts')
        .where('userId', '==', useUsersStore().authId)
        .orderBy('publishedAt', 'desc')
        .limit(10)

      if (startAfter) {
        const doc = await firebase.firestore().collection('posts').doc(startAfter.id).get()
        query = query.startAfter(doc)
      }

      const posts = await query.get()
      posts.forEach(post => {
        upsert(docToResource(post), this.posts)
      })
    },
    async createPost (post) {
      const usersStore = useUsersStore()
      // setup post vars
      post.userId = usersStore.authId
      post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
      post.firstInThread = post.firstInThread || false

      // firebasssseeee
      const batch = firebase.firestore().batch()
      const postRef = firebase.firestore().collection('posts').doc()
      const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
      const userRef = firebase.firestore().collection('users').doc(usersStore.authId)
      batch.set(postRef, post)
      const threadUpdates = {
        posts: firebase.firestore.FieldValue.arrayUnion(postRef.id)
      }
      if (!post.firstInThread) threadUpdates.contributors = firebase.firestore.FieldValue.arrayUnion(post.userId)

      batch.update(threadRef, threadUpdates)
      batch.update(userRef, {
        postsCount: firebase.firestore.FieldValue.increment(1)
      })

      await batch.commit()
      const newPost = await postRef.get()

      // save post
      post = docToResource(newPost)
      this.posts.push(post)

      // save threads
      const threadsStore = useThreadsStore()
      threadsStore.addPostToThread(post.id, post.threadId)
      if (!post.firstInThread) threadsStore.addContributorToThread(post.userId, post.threadId)
    },
    async updatePost (post) {
      // firebasssseeee
      const postRef = firebase.firestore().collection('posts').doc(post.id)

      await postRef.update({
        text: post.text,
        edited: {
          at: firebase.firestore.FieldValue.serverTimestamp(),
          by: useUsersStore().authId,
          moderated: false
        }
      })
      // this.fetchPost(post.id)
      const newPost = await postRef.get()
      post = docToResource(newPost)
      upsert(post, this.posts)
    }
  }
})
