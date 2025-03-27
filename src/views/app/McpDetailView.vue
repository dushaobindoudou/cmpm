<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMcpStore } from '../../stores/mcp'

const route = useRoute()
const mcpStore = useMcpStore()
const loading = ref(true)
const activeTab = ref('about')

// Get MCP ID from route
const mcpId = computed(() => route.params.id as string)

// Get MCP details
const mcp = computed(() => mcpStore.getMcpById(mcpId.value))

// Fetch data
onMounted(async () => {
  loading.value = true
  if (mcpStore.mcps.length === 0) {
    await mcpStore.fetchMcps()
  }
  loading.value = false
})

// Install MCP
const installMcp = async () => {
  await mcpStore.installMcp(mcpId.value)
}

// Uninstall MCP
const uninstallMcp = async () => {
  await mcpStore.uninstallMcp(mcpId.value)
}

// Update MCP
const updateMcp = async () => {
  await mcpStore.updateMcp(mcpId.value)
}

// Open installed MCP
const openMcp = async () => {
  try {
    await mcpStore.openInstalledMcp(mcpId.value)
  } catch (error) {
    console.error('Failed to open MCP:', error)
  }
}
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-mac-blue"></div>
    </div>
    
    <!-- MCP not found -->
    <div v-else-if="!mcp" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium mb-2">MCP Not Found</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">The MCP you're looking for doesn't exist or has been removed</p>
      <router-link to="/app/discover" class="mac-button px-6 py-2">
        Back to Discover
      </router-link>
    </div>
    
    <!-- MCP details -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-start gap-6 mb-6">
        <img :src="mcp.icon" :alt="mcp.name" class="w-24 h-24 rounded-mac">
        
        <div class="flex-1">
          <div class="flex justify-between">
            <div>
              <h1 class="text-2xl font-medium">{{ mcp.name }}</h1>
              <p class="text-gray-500 dark:text-gray-400">{{ mcp.developer }}</p>
            </div>
            
            <div v-if="!mcp.installed">
              <button @click="installMcp" class="mac-button px-6 py-2">
                Install
              </button>
            </div>
            <div v-else class="flex space-x-3">
              <button @click="updateMcp" class="mac-button-secondary px-4 py-2">
                Update
              </button>
              <button @click="uninstallMcp" class="text-mac-error border border-mac-error px-4 py-2 rounded-mac hover:bg-red-50 dark:hover:bg-red-900">
                Uninstall
              </button>
            </div>
          </div>
          
          <div class="flex mt-2 items-center">
            <div class="flex text-yellow-500">
              <span v-for="i in 5" :key="i" class="text-lg">★</span>
            </div>
            <span class="ml-2">{{ mcp.rating }} ({{ mcp.reviewCount }} reviews)</span>
            <span class="mx-4">•</span>
            <span>{{ mcp.downloads.toLocaleString() }} downloads</span>
            <span class="mx-4">•</span>
            <span>Version {{ mcp.currentVersion }}</span>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="border-b border-mac-border dark:border-gray-700 mb-6">
        <nav class="flex space-x-8">
          <button 
            @click="activeTab = 'about'" 
            :class="[
              'py-3 border-b-2 font-medium text-sm',
              activeTab === 'about' 
                ? 'border-mac-blue text-mac-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            ]"
          >
            About
          </button>
          <button 
            @click="activeTab = 'screenshots'" 
            :class="[
              'py-3 border-b-2 font-medium text-sm',
              activeTab === 'screenshots' 
                ? 'border-mac-blue text-mac-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            ]"
          >
            Screenshots
          </button>
          <button 
            @click="activeTab = 'versions'" 
            :class="[
              'py-3 border-b-2 font-medium text-sm',
              activeTab === 'versions' 
                ? 'border-mac-blue text-mac-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            ]"
          >
            Versions
          </button>
          <button 
            @click="activeTab = 'reviews'" 
            :class="[
              'py-3 border-b-2 font-medium text-sm',
              activeTab === 'reviews' 
                ? 'border-mac-blue text-mac-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
            ]"
          >
            Reviews
          </button>
        </nav>
      </div>
      
      <!-- Tab content -->
      <div>
        <!-- About -->
        <div v-if="activeTab === 'about'" class="space-y-6">
          <div>
            <h2 class="text-lg font-medium mb-3">Description</h2>
            <p class="text-gray-700 dark:text-gray-300">{{ mcp.description }}</p>
          </div>
          
          <div>
            <h2 class="text-lg font-medium mb-3">Categories</h2>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="categoryId in mcp.categories" 
                :key="categoryId"
                class="px-3 py-1 bg-mac-gray dark:bg-gray-700 rounded-full text-sm"
              >
                {{ mcpStore.categories.find(cat => cat.id === categoryId)?.name }}
              </div>
            </div>
          </div>
          
          <div>
            <h2 class="text-lg font-medium mb-3">Tags</h2>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="tag in mcp.tags" 
                :key="tag"
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 text-mac-blue rounded-full text-sm"
              >
                {{ tag }}
              </div>
            </div>
          </div>
          
          <div v-if="mcp.installed">
            <h2 class="text-lg font-medium mb-3">Installation</h2>
            <div class="mac-card">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm"><span class="font-medium">Install location:</span> {{ mcp.installPath }}</p>
                  <p class="text-sm"><span class="font-medium">Last updated:</span> {{ mcp.lastUpdated }}</p>
                </div>
                <button @click="openMcp" class="mac-button-secondary px-4 py-2">
                  Open
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Screenshots -->
        <div v-else-if="activeTab === 'screenshots'" class="space-y-6">
          <div v-if="mcp.screenshots.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="(screenshot, index) in mcp.screenshots" 
              :key="index"
              class="mac-card p-2"
            >
              <img 
                :src="screenshot" 
                :alt="`${mcp.name} screenshot ${index + 1}`"
                class="w-full h-auto rounded-mac"
              >
            </div>
          </div>
          <div v-else class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">No screenshots available</p>
          </div>
        </div>
        
        <!-- Versions -->
        <div v-else-if="activeTab === 'versions'" class="space-y-6">
          <div v-if="mcp.versions.length > 0">
            <div 
              v-for="(version, index) in mcp.versions" 
              :key="index"
              class="mac-card mb-4"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium">Version {{ version.version }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Released on {{ version.releaseDate }}</p>
                </div>
                <div v-if="index === 0 && mcp.currentVersion === version.version" class="px-2 py-1 bg-green-100 dark:bg-green-900 dark:bg-opacity-30 text-green-800 dark:text-green-200 rounded-mac text-xs">
                  Current
                </div>
              </div>
              
              <div class="mt-3">
                <h4 class="text-sm font-medium mb-2">Changes:</h4>
                <ul class="list-disc pl-5 text-sm space-y-1">
                  <li v-for="(change, i) in version.changes" :key="i">
                    {{ change }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">No version history available</p>
          </div>
        </div>
        
        <!-- Reviews -->
        <div v-else-if="activeTab === 'reviews'" class="space-y-6">
          <div class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">No reviews available yet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 