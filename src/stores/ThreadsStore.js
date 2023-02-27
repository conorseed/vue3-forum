import { defineStore } from 'pinia'
import { usePostsStore } from './PostsStore'
import { useUsersStore } from './UsersStore'
import { useForumsStore } from './ForumsStore'
import { findById, filterByValue, addChildToParent, fetchItem, fetchItems, docToResource, upsert } from '@/helpers'
import firebase from '@/helpers/firebase'
import chunk from 'lodash/chunk'

export const useThreadsStore = defineStore('ThreadsStore', {
  state: () => {
    return {
      threads: []
    }
  },
  getters: {
    threadById () {
      return (id) => {
        const thread = findById(this.threads, id)
        if (!thread) return {}
        return {
          ...thread,
          get author () {
            return findById(useUsersStore().users, this.userId)
          },
          get repliesCount () {
            return this.posts?.length - 1
          },
          get contributorsCount () {
            if (!thread.contributors) return 0
            return this.contributors?.length
          }
        }
      }
    },
    postsInThread () {
      return (id) => filterByValue(usePostsStore().posts, 'threadId', id)
    }
  },
  actions: {
    async fetchThread (payload) {
      return await fetchItem({ emoji: '📄', resource: 'threads', store: this.threads, ...payload })
    },
    async fetchThreads (payload) {
      return await fetchItems({ emoji: '📄', resource: 'threads', store: this.threads, ...payload })
    },
    async fetchAuthUsersThreads () {
      const threads = await firebase.firestore().collection('threads').where('userId', '==', useUsersStore().authId).get()
      threads.forEach(thread => {
        upsert(docToResource(thread), this.threads)
      })
    },
    async fetchThreadsByPage (ids, page, perPage = 2) {
      this.threads = []
      const pages = chunk(ids, perPage)
      const newPage = pages[page - 1]
      return this.fetchThreads({ ids: newPage })
    },
    async createThread (title, text, forumId) {
      // setup post vars
      const userId = useUsersStore().authId
      const publishedAt = firebase.firestore.FieldValue.serverTimestamp()

      // firestore
      const threadRef = firebase.firestore().collection('threads').doc()
      const userRef = firebase.firestore().collection('users').doc(userId)
      const forumRef = firebase.firestore().collection('forums').doc(forumId)

      // create thread
      let thread = { forumId, publishedAt, title, userId }

      // firestore batch
      const batch = firebase.firestore().batch()

      batch.set(threadRef, thread)
      batch.update(userRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      batch.update(forumRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })

      await batch.commit()

      // save it yo
      const newThread = await threadRef.get()
      thread = docToResource(newThread)
      this.threads.push(thread)
      this.addThreadToForum(thread.id, forumId)
      await usePostsStore().createPost({ text, threadId: thread.id, firstInThread: true })

      return findById(this.threads, thread.id)
    },
    async updateThread (title, text, threadId) {
      // get the thread and post
      const thread = findById(this.threads, threadId)
      const post = findById(usePostsStore().posts, thread.posts[0])

      // Firestore
      const threadRef = firebase.firestore().collection('threads').doc(threadId)
      const postRef = firebase.firestore().collection('posts').doc(post.id)

      const batch = firebase.firestore().batch()
      batch.update(threadRef, { ...thread, title })
      batch.update(postRef, { ...post, text })

      await batch.commit()

      // get updates
      const newThread = await threadRef.get()
      const newPost = await postRef.get()

      // update values
      thread.title = newThread.title
      post.text = newPost.text

      return thread
    },
    addPostToThread (postId, threadId) {
      return addChildToParent('posts', postId, this.threads, threadId)
    },
    addThreadToForum (threadId, forumId) {
      return addChildToParent('threads', threadId, useForumsStore().forums, forumId)
    },
    addContributorToThread (contributorId, threadId) {
      return addChildToParent('contributors', contributorId, this.threads, threadId)
    }

  }
})
