import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface NotificationOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<(NotificationOptions & { id: number })[]>([])
  let nextId = 0

  const show = (options: NotificationOptions) => {
    const id = nextId++
    notifications.value.push({
      ...options,
      id,
      duration: options.duration ?? 5000,
    })
    return id
  }

  const success = (title: string, message?: string, duration?: number) => {
    return show({ type: 'success', title, message, duration })
  }

  const error = (title: string, message?: string, duration?: number) => {
    return show({ type: 'error', title, message, duration })
  }

  const warning = (title: string, message?: string, duration?: number) => {
    return show({ type: 'warning', title, message, duration })
  }

  const info = (title: string, message?: string, duration?: number) => {
    return show({ type: 'info', title, message, duration })
  }

  const remove = (id: number) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clear = () => {
    notifications.value = []
  }

  return {
    notifications,
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear,
  }
}) 