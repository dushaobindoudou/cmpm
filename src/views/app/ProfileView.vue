<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-medium">Profile</h1>
      <p class="text-gray-500 dark:text-gray-400">Manage your account</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Profile info -->
      <div class="mac-card col-span-1">
        <div class="flex flex-col items-center">
          <div class="w-24 h-24 rounded-full bg-mac-blue text-white flex items-center justify-center text-4xl font-bold mb-4">
            {{ authStore.user?.name.charAt(0) }}
          </div>
          
          <h2 class="text-xl font-medium">{{ authStore.user?.name }}</h2>
          <p class="text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
          
          <button class="mac-button mt-6 w-full">
            Edit Profile
          </button>
        </div>
      </div>
      
      <!-- Activity -->
      <div class="mac-card col-span-2">
        <h2 class="text-lg font-medium mb-4">Recent Activity</h2>
        
        <div class="divide-y divide-mac-border dark:divide-gray-700">
          <div class="py-3">
            <p class="text-sm">No recent activity</p>
          </div>
        </div>
      </div>
      
      <!-- Preferences -->
      <div class="mac-card col-span-3">
        <h2 class="text-lg font-medium mb-4">Account Preferences</h2>
        
        <div class="space-y-4">
          <div>
            <h3 class="font-medium mb-2">Email Preferences</h3>
            <div class="flex items-center">
              <input type="checkbox" id="update-emails" class="mr-2">
              <label for="update-emails" class="text-sm">Receive update notifications</label>
            </div>
            <div class="flex items-center mt-2">
              <input type="checkbox" id="marketing-emails" class="mr-2">
              <label for="marketing-emails" class="text-sm">Receive marketing emails</label>
            </div>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">Danger Zone</h3>
            <button class="text-mac-error border border-mac-error px-4 py-2 rounded-mac hover:bg-red-50 dark:hover:bg-red-900">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 