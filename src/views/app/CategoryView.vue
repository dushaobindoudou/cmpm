<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMcpStore } from '../../stores/mcp'

const route = useRoute()
const mcpStore = useMcpStore()
const loading = ref(true)

// Get category ID from route
const categoryId = computed(() => route.params.category as string)

// Get category details
const category = computed(() => {
  return mcpStore.categories.find(cat => cat.id === categoryId.value)
})

// Get MCPs for this category
const mcps = computed(() => {
  return mcpStore.getMcpsByCategory(categoryId.value)
})

// Fetch data
onMounted(async () => {
  loading.value = true
  if (mcpStore.mcps.length === 0) {
    await mcpStore.fetchMcps()
  }
  loading.value = false
})

// Install MCP
const installMcp = async (mcpId: string) => {
  await mcpStore.installMcp(mcpId)
}
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-mac-blue"></div>
    </div>
    
    <!-- Category not found -->
    <div v-else-if="!category" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium mb-2">Category Not Found</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">The category you're looking for doesn't exist</p>
      <router-link to="/app/discover" class="mac-button px-6 py-2">
        Back to Discover
      </router-link>
    </div>
    
    <!-- Category details -->
    <div v-else>
      <div class="mb-6">
        <h1 class="text-2xl font-medium">{{ category.name }}</h1>
        <p class="text-gray-500 dark:text-gray-400">Browse {{ category.name }} MCPs</p>
      </div>
      
      <!-- No MCPs in category -->
      <div v-if="mcps.length === 0" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">No MCPs available in this category yet</p>
      </div>
      
      <!-- MCPs in category -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="mcp in mcps" :key="mcp.id" class="mac-card">
          <div class="flex items-start">
            <img :src="mcp.icon" :alt="mcp.name" class="w-16 h-16 rounded-mac mr-4">
            <div class="flex-1">
              <router-link :to="`/app/mcp/${mcp.id}`" class="hover:text-mac-blue">
                <h3 class="font-medium">{{ mcp.name }}</h3>
              </router-link>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ mcp.developer }}</p>
              <div class="flex items-center mt-1">
                <div class="flex text-yellow-500">
                  <span v-for="i in 5" :key="i" class="text-xs">★</span>
                </div>
                <span class="text-xs ml-1">{{ mcp.rating }}</span>
              </div>
            </div>
          </div>
          <p class="text-sm my-3 line-clamp-2">{{ mcp.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ mcp.downloads.toLocaleString() }} downloads</span>
            <button 
              @click="installMcp(mcp.id)" 
              :disabled="mcp.installed"
              :class="[
                'px-4 py-1 text-sm rounded-mac',
                mcp.installed ? 'bg-gray-100 text-gray-400 dark:bg-gray-700' : 'mac-button'
              ]"
            >
              {{ mcp.installed ? 'Installed' : 'Install' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 