<script setup lang="ts">
// Auth layout component
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-mac-light dark:bg-mac-dark">
    <div class="mac-window w-full max-w-md">
      <!-- macOS-style window header -->
      <div class="mac-titlebar">
        <div class="mac-traffic-lights">
          <div class="mac-light-red"></div>
          <div class="mac-light-yellow"></div>
          <div class="mac-light-green"></div>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-8 bg-white dark:bg-mac-dark dark:text-white">
        <div class="mb-6 text-center">
          <h1 class="text-2xl font-medium">MCP Management Platform</h1>
          <p class="text-gray-500 dark:text-gray-400">Your MCP App Store</p>
        </div>
        
        <router-view />
      </div>
    </div>
  </div>
</template> 