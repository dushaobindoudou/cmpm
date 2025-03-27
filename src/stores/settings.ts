import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark' | 'system'

interface SettingsState {
  theme: ThemeMode
  autoUpdate: boolean
  notificationsEnabled: boolean
  notificationSounds: boolean
  startOnLogin: boolean
  minimizeToTray: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: 'system',
    autoUpdate: true,
    notificationsEnabled: true,
    notificationSounds: true,
    startOnLogin: false,
    minimizeToTray: true
  }),
  
  getters: {
    isDarkMode(): boolean {
      if (this.theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      return this.theme === 'dark'
    }
  },
  
  actions: {
    setTheme(theme: ThemeMode) {
      this.theme = theme
      this.applyTheme()
    },
    
    setAutoUpdate(value: boolean) {
      this.autoUpdate = value
    },
    
    setNotificationsEnabled(value: boolean) {
      this.notificationsEnabled = value
    },
    
    setNotificationSounds(value: boolean) {
      this.notificationSounds = value
    },
    
    setStartOnLogin(value: boolean) {
      this.startOnLogin = value
      // Here we would use Electron APIs to actually set app to start on login
    },
    
    setMinimizeToTray(value: boolean) {
      this.minimizeToTray = value
    },
    
    applyTheme() {
      // Logic to apply the theme to the DOM
      const isDark = this.isDarkMode
      
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    
    // Initialize settings
    init() {
      this.applyTheme()
      
      // Setup system theme change listener
      if (this.theme === 'system') {
        window.matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', () => this.applyTheme())
      }
    }
  },
  
  // Persist settings
  persist: true
}) 