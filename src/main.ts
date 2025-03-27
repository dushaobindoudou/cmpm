import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// Import base CSS
import './assets/css/index.css'

// IPC for Electron
import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

// Create the app
const app = createApp(App)

// Setup Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Setup Router
app.use(router)

// Mount the app
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
