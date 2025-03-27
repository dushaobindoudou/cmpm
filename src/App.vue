<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useSettingsStore } from './stores/settings'
import { RouterView } from 'vue-router'
import NotificationContainer from './components/NotificationContainer.vue'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()

onMounted(() => {
  // Initialize stores
  authStore.init()
  settingsStore.init()
})
</script>

<template>
  <div class="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <router-view />
    <NotificationContainer />
  </div>
</template>

<style>
/* Global styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

/* Enable smooth scrolling */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Dark mode transition */
.dark-mode-transition {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
