<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const register = async () => {
  // Basic validation
  if (!name.value || !email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }
  
  error.value = ''
  loading.value = true
  
  try {
    await authStore.register(name.value, email.value, password.value)
    router.push('/app/discover')
  } catch (e) {
    error.value = 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="register" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
        <input 
          id="name" 
          type="text" 
          v-model="name" 
          class="mac-input" 
          placeholder="Enter your name"
          :disabled="loading"
        />
      </div>
      
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
          placeholder="Choose a password"
          :disabled="loading"
        />
      </div>
      
      <div>
        <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
        <input 
          id="confirm-password" 
          type="password" 
          v-model="confirmPassword" 
          class="mac-input" 
          placeholder="Confirm your password"
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
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
      </div>
      
      <div class="border-t border-mac-border dark:border-gray-600 pt-4 mt-4">
        <div class="text-sm text-center">
          Already have an account?
          <router-link to="/" class="text-mac-accent hover:underline">
            Sign in instead
          </router-link>
        </div>
      </div>
    </form>
  </div>
</template> 