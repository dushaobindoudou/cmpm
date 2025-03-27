<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMcpStore } from '../../stores/mcp'

const mcpStore = useMcpStore()
const loading = ref(true)

// Fetch MCPs on mount
onMounted(async () => {
  loading.value = true
  await mcpStore.fetchMcps()
  loading.value = false
})

// Uninstall MCP
const uninstallMcp = async (mcpId: string) => {
  await mcpStore.uninstallMcp(mcpId)
}

// Update MCP
const updateMcp = async (mcpId: string) => {
  await mcpStore.updateMcp(mcpId)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-medium">Library</h1>
      <p class="text-gray-500 dark:text-gray-400">Manage your installed MCPs</p>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-mac-blue"></div>
    </div>
    
    <!-- Installed MCPs -->
    <div v-else-if="mcpStore.getInstalledMcps.length > 0">
      <div class="space-y-4">
        <div v-for="mcp in mcpStore.getInstalledMcps" :key="mcp.id" class="mac-card">
          <div class="flex items-start">
            <img :src="mcp.icon" :alt="mcp.name" class="w-16 h-16 rounded-mac mr-4">
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium">{{ mcp.name }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ mcp.developer }}</p>
                  <p class="text-sm mt-1">Version {{ mcp.currentVersion }}</p>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="updateMcp(mcp.id)" 
                    class="mac-button-secondary text-xs px-3 py-1"
                  >
                    Update
                  </button>
                  <button 
                    @click="uninstallMcp(mcp.id)" 
                    class="text-mac-error border border-mac-error text-xs px-3 py-1 rounded-mac hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Uninstall
                  </button>
                </div>
              </div>
              
              <div class="mt-3">
                <p class="text-sm">{{ mcp.description }}</p>
              </div>
              
              <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                <p><span class="font-medium">Install location:</span> {{ mcp.installPath }}</p>
                <p><span class="font-medium">Last updated:</span> {{ mcp.lastUpdated }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- No installed MCPs -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 class="text-lg font-medium mb-2">No installed MCPs</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Visit the Discover page to find and install MCPs</p>
      <router-link to="/app/discover" class="mac-button px-6 py-2">
        Browse MCPs
      </router-link>
    </div>
  </div>
</template> 