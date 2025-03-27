<!-- src/components/NotificationContainer.vue -->
<script setup lang="ts">
import { useNotificationStore } from '../stores/notification'
import Notification from './Notification.vue'

const notificationStore = useNotificationStore()
</script>

<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <Notification
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        v-bind="notification"
        :show="true"
        @close="notificationStore.remove(notification.id)"
      />
    </div>
  </div>
</template> 