<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const email = ref('')
const success = ref(false)
const error = ref('')
const loading = ref(false)

const resetPassword = async () => {
  if (!email.value) {
    error.value = 'Please enter your email'
    return
  }
  
  error.value = ''
  loading.value = true
  
  try {
    await authStore.forgotPassword(email.value)
    success.value = true
  } catch (e) {
    error.value = 'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div v-if="!success">
      <form @submit.prevent="resetPassword" class="space-y-4">
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
        
        <div v-if="error" class="text-mac-error text-sm">{{ error }}</div>
        
        <div class="pt-2">
          <button 
            type="submit" 
            class="mac-button w-full"
            :disabled="loading"
          >
            {{ loading ? 'Sending reset link...' : 'Send reset link' }}
          </button>
        </div>
        
        <div class="text-center mt-4">
          <router-link to="/" class="text-sm text-mac-accent hover:underline">
            Back to sign in
          </router-link>
        </div>
      </form>
    </div>
    
    <div v-else class="text-center">
      <div class="text-mac-success mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium mb-2">Reset link sent!</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        We've sent a password reset link to {{ email }}. Please check your email.
      </p>
      <router-link to="/" class="mac-button inline-block">
        Return to sign in
      </router-link>
    </div>
  </div>
</template> 