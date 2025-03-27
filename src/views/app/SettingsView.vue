<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../../stores/settings'
import { useAuthStore } from '../../stores/auth'
import type { ThemeMode } from '../../stores/settings'

declare global {
  interface Window {
    cmpm: {
      getPlatform: () => Promise<string>
      getSystemTheme: () => Promise<'light' | 'dark'>
      setAutoLaunch: (enable: boolean) => Promise<void>
    }
  }
}

const settingsStore = useSettingsStore()
const authStore = useAuthStore()

// Get settings from store
const theme = ref(settingsStore.theme)
const autoUpdate = ref(settingsStore.autoUpdate)
const notificationsEnabled = ref(settingsStore.notificationsEnabled)
const notificationSounds = ref(settingsStore.notificationSounds)
const startOnLogin = ref(settingsStore.startOnLogin)
const minimizeToTray = ref(settingsStore.minimizeToTray)
const platform = ref<string>('unknown')

// Get system info on mount
onMounted(async () => {
  if (window.cmpm) {
    try {
      platform.value = await window.cmpm.getPlatform()
      
      // Get system theme if set to system
      if (theme.value === 'system') {
        const systemTheme = await window.cmpm.getSystemTheme()
        console.log('System theme:', systemTheme)
      }
    } catch (error) {
      console.error('Error getting system info:', error)
    }
  }
})

// Save theme setting
const saveTheme = (newTheme: ThemeMode) => {
  theme.value = newTheme
  settingsStore.setTheme(newTheme)
}

// Save toggle settings
const saveToggleSetting = async (setting: string, value: boolean) => {
  switch (setting) {
    case 'autoUpdate':
      autoUpdate.value = value
      settingsStore.setAutoUpdate(value)
      break
    case 'notifications':
      notificationsEnabled.value = value
      settingsStore.setNotificationsEnabled(value)
      break
    case 'sounds':
      notificationSounds.value = value
      settingsStore.setNotificationSounds(value)
      break
    case 'startup':
      startOnLogin.value = value
      settingsStore.setStartOnLogin(value)
      
      // Set auto launch in Electron
      if (window.cmpm) {
        try {
          await window.cmpm.setAutoLaunch(value)
        } catch (error) {
          console.error('Error setting auto launch:', error)
        }
      }
      break
    case 'tray':
      minimizeToTray.value = value
      settingsStore.setMinimizeToTray(value)
      break
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-medium">Settings</h1>
      <p class="text-gray-500 dark:text-gray-400">Customize your experience</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Appearance settings -->
      <div class="mac-card col-span-1">
        <h2 class="text-lg font-medium mb-4">Appearance</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
            <div class="flex space-x-4">
              <button 
                @click="saveTheme('light')" 
                :class="[
                  'flex items-center justify-center w-full h-12 rounded-mac border transition-all',
                  theme === 'light' 
                    ? 'border-mac-blue text-mac-blue bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' 
                    : 'border-mac-border text-gray-700 dark:text-gray-300'
                ]"
              >
                Light
              </button>
              <button 
                @click="saveTheme('dark')" 
                :class="[
                  'flex items-center justify-center w-full h-12 rounded-mac border transition-all',
                  theme === 'dark' 
                    ? 'border-mac-blue text-mac-blue bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' 
                    : 'border-mac-border text-gray-700 dark:text-gray-300'
                ]"
              >
                Dark
              </button>
              <button 
                @click="saveTheme('system')" 
                :class="[
                  'flex items-center justify-center w-full h-12 rounded-mac border transition-all',
                  theme === 'system' 
                    ? 'border-mac-blue text-mac-blue bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' 
                    : 'border-mac-border text-gray-700 dark:text-gray-300'
                ]"
              >
                System
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Application settings -->
      <div class="mac-card col-span-2">
        <h2 class="text-lg font-medium mb-4">Application</h2>
        
        <div class="divide-y divide-mac-border dark:divide-gray-700">
          <!-- Auto update -->
          <div class="py-3 flex justify-between items-center">
            <div>
              <h3 class="font-medium">Automatic updates</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Keep MCPs up to date automatically</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="autoUpdate" 
                @change="saveToggleSetting('autoUpdate', autoUpdate)"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-mac-blue"></div>
            </label>
          </div>
          
          <!-- Notifications -->
          <div class="py-3 flex justify-between items-center">
            <div>
              <h3 class="font-medium">Notifications</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Enable system notifications</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="notificationsEnabled" 
                @change="saveToggleSetting('notifications', notificationsEnabled)"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-mac-blue"></div>
            </label>
          </div>
          
          <!-- Notification sounds -->
          <div class="py-3 flex justify-between items-center">
            <div>
              <h3 class="font-medium">Notification sounds</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Play sounds for notifications</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="notificationSounds" 
                @change="saveToggleSetting('sounds', notificationSounds)"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-mac-blue"></div>
            </label>
          </div>
          
          <!-- Start on login -->
          <div class="py-3 flex justify-between items-center">
            <div>
              <h3 class="font-medium">Start on login</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Launch application when your computer starts</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="startOnLogin" 
                @change="saveToggleSetting('startup', startOnLogin)"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-mac-blue"></div>
            </label>
          </div>
          
          <!-- Minimize to tray -->
          <div class="py-3 flex justify-between items-center">
            <div>
              <h3 class="font-medium">Minimize to tray</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Keep application running in the system tray when closed</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="minimizeToTray" 
                @change="saveToggleSetting('tray', minimizeToTray)"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-mac-blue"></div>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Account settings -->
      <div class="mac-card col-span-3">
        <h2 class="text-lg font-medium mb-4">Account</h2>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">{{ authStore.user?.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
          </div>
          
          <button 
            @click="authStore.logout()" 
            class="text-mac-error border border-mac-error px-4 py-2 rounded-mac hover:bg-red-50 dark:hover:bg-red-900"
          >
            Sign out
          </button>
        </div>
      </div>
      
      <!-- About -->
      <div class="mac-card col-span-3">
        <h2 class="text-lg font-medium mb-4">About</h2>
        
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-medium">MCP Management Platform</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</p>
          </div>
          
          <div class="text-sm text-gray-500">
            &copy; 2023 CMPM Team
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 