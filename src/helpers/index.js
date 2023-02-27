import firebase from '@/helpers/firebase'
import { useFirebaseStore } from '../stores/FirebaseStore'

export const findById = (resources, id) => {
  if (!resources) return {}
  return resources.find(r => r.id === id)
}

export const filterByValue = (resources, key, value) => {
  return resources.filter(r => r[key] === value)
}

export const upsert = (resourceToUpdate, store) => {
  const resourceIndex = store.findIndex(r => r.id === resourceToUpdate.id)
  if (resourceToUpdate.id && resourceIndex !== -1) {
    store[resourceIndex] = resourceToUpdate
    return true
  }
  store.push(resourceToUpdate)
  return true
}

export const checkResourceExistsGuard = async (resources, resource, emoji, to, once = true) => {
  await fetchItem({ id: to.params.id, emoji, resource, store: resources, once })
  const resourceExists = findById(resources, to.params.id)
  if (resourceExists) {
    return false
  }
  return {
    name: '404',
    params: { pathMatch: to.path.substring(1).split('/') },
    query: to.query,
    hash: to.hash
  }
}

export function addChildToParent (child, childId, parent, parentId) {
  const r = findById(parent, parentId)
  r[child] = r[child] || []
  if (!r) {
    console.warn(`Appending ${child} ${childId} to ${parent} ${parentId} failed because parent didn't exist`)
    return
  }
  if (!r[child].includes(childId)) {
    r[child].push(childId)
  }
}

export async function fetchItem ({ id, emoji, resource, store, handleUnsubscribe = null, once = false, onSnapshot = null }) {
  return new Promise(resolve => {
    const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot(doc => {
      if (once) {
        unsubscribe()
      }
      if (!doc.exists) {
        resolve(null)
      } else {
        const item = { ...doc.data(), id: doc.id }
        let previousItem = findById(store, id)
        previousItem = previousItem ? { ...previousItem } : null
        upsert(item, store)
        if (typeof onSnapshot === 'function') {
          const isLocal = doc.metadata.hasPendingWrites
          onSnapshot({ item: { ...item }, previousItem, isLocal })
        }
        resolve(item)
      }
    })
    if (handleUnsubscribe) {
      handleUnsubscribe(unsubscribe)
    } else {
      useFirebaseStore().appendUnsubscribe(unsubscribe)
    }
  })
}

export async function fetchItems ({ ids, emoji, resource, store, onSnapshot = null }) {
  if (!ids || !ids.length) return []
  return Promise.all(
    ids.map(id => fetchItem({ id, emoji, resource, store, onSnapshot }))
  )
}

export function docToResource (doc) {
  if (typeof doc?.data !== 'function') return doc
  return { ...doc.data(), id: doc.id }
}

export function arrayRandom (array) {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}
