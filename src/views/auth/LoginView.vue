<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const login = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password'
    return
  }
  
  error.value = ''
  loading.value = true
  
  try {
    await authStore.login(email.value, password.value)
    router.push('/app/discover')
  } catch (e) {
    error.value = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input 
          id="email" 
          type="email" 
          v-model="email" 
          class="mac-input" 
          placeholder="Enter your email"
          :disabled="loading"
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input 
          id="password" 
          type="password" 
          v-model="password" 
          class="mac-input" 
          placeholder="Enter your password"
          :disabled="loading"
        />
      </div>
      
      <div v-if="error" class="text-mac-error text-sm">{{ error }}</div>
      
      <div class="pt-2">
        <button 
          type="submit" 
          class="mac-button w-full"
          :disabled="loading"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </div>
      
      <div class="text-center">
        <router-link to="/forgot-password" class="text-sm text-mac-accent hover:underline">
          Forgot your password?
        </router-link>
      </div>
      
      <div class="border-t border-mac-border dark:border-gray-600 pt-4 mt-4">
        <div class="text-sm text-center">
          Don't have an account?
          <router-link to="/register" class="text-mac-accent hover:underline">
            Create one now
          </router-link>
        </div>
      </div>
    </form>
  </div>
</template> 