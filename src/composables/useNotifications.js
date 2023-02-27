import { ref } from 'vue'

const notifications = ref([])

const addNotification = ({ message, timeout, type = 'info' }) => {
  const notification = {
    id: Math.random() + Date.now(),
    message,
    timeout,
    type
  }

  notifications.value.push(notification)

  if (notification.timeout) {
    setTimeout(() => {
      removeNotification(notification.id)
    }, notification.timeout)
  }
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(item => item.id === id)
  notifications.value.splice(index, 1)
}

export default function useNotifications () {
  return {
    notifications,
    addNotification,
    removeNotification
  }
}
