<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useMcpStore } from '../../stores/mcp'
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const mcpStore = useMcpStore()
const loading = ref(true)
const currentSlide = ref(0)
const searchQuery = ref('')

interface Mcp {
  id: string
  name: string
  description: string
  icon: string
  screenshots: string[]
  developer: string
  categories: string[]
  tags: string[]
  rating: number
  reviewCount: number
  downloads: number
  installed: boolean
  versions: Array<{
    version: string
    releaseDate: string
    changes: string[]
  }>
  lastUpdated: string
}

// Featured MCPs for carousel
const featuredMcps = computed(() => mcpStore.getFeaturedMcps.slice(0, 5))

// Categorized MCPs
const serverMcps = computed(() => mcpStore.getServerMcps.slice(0, 10))
const toolsMcps = computed(() => mcpStore.getToolMcps.slice(0, 10))
const clientMcps = computed(() => mcpStore.getClientMcps.slice(0, 10))

// Filtered search results
const filteredMcps = computed(() => {
  if (!searchQuery.value) return []
  return mcpStore.searchMcps(searchQuery.value)
})

// Carousel controls
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % featuredMcps.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? featuredMcps.value.length - 1 
    : currentSlide.value - 1
}

// Auto advance carousel
let autoplayInterval: NodeJS.Timeout
onMounted(async () => {
  loading.value = true
  await mcpStore.fetchMcps()
  loading.value = false

  autoplayInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
})

// Handle MCP installation
const installMcp = async (mcpId: string) => {
  await mcpStore.installMcp(mcpId)
}
</script>

<template>
  <div class="px-8 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header with search -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Discover</h1>
        <p class="mt-1.5 text-[13px] text-gray-600 dark:text-gray-400">Explore the best MCPs for your needs</p>
      </div>
      
      <!-- Search bar -->
      <div class="mt-4 sm:mt-0 max-w-md w-full">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search MCPs..."
            class="w-full pl-9 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#2356f6]/30 focus:border-transparent backdrop-blur-sm transition shadow-sm hover:shadow"
          />
        </div>
      </div>
    </div>

    <!-- Search Results (only shown when searching) -->
    <div v-if="searchQuery && !loading" class="mb-12">
      <h2 class="text-xl font-medium text-gray-900 dark:text-white mb-6">Search Results</h2>
      <div v-if="filteredMcps.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="mcp in filteredMcps" :key="mcp.id"
             class="group bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all hover:translate-y-[-2px] backdrop-blur-sm overflow-hidden">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/90 to-indigo-600/90 flex items-center justify-center mr-4 shadow-sm">
                <img :src="mcp.icon" :alt="mcp.name" class="w-7 h-7 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ mcp.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ mcp.developer }}</p>
                <div class="flex items-center mt-1">
                  <div class="flex text-yellow-400">
                    <span v-for="i in 5" :key="i" class="text-xs">★</span>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">{{ mcp.rating }}</span>
                </div>
              </div>
            </div>
            <p class="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ mcp.description }}</p>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ mcp.downloads.toLocaleString() }} downloads
              </span>
              <button @click="installMcp(mcp.id)"
                      :disabled="mcp.installed"
                      class="mac-button">
                {{ mcp.installed ? 'Installed' : 'Install' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
        No results found for "{{ searchQuery }}"
      </div>
    </div>

    <!-- Main content when not searching -->
    <div v-if="!searchQuery">
      <!-- Featured Carousel -->
      <div v-if="!loading" class="relative mb-12 rounded-2xl overflow-hidden shadow-md">
        <div class="relative aspect-[21/9] bg-gray-900">
          <!-- Carousel slides -->
          <transition-group name="fade">
            <div 
              v-for="(mcp, index) in featuredMcps" 
              :key="mcp.id"
              v-show="currentSlide === index"
              class="absolute inset-0"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/20 z-10"></div>
              <img 
                :src="mcp.screenshots && mcp.screenshots.length > 0 ? mcp.screenshots[0] : '/default-banner.jpg'" 
                :alt="mcp.name"
                class="w-full h-full object-cover"
              />
              <div class="absolute bottom-0 left-0 p-8 z-20 max-w-2xl">
                <h2 class="text-2xl font-bold text-white mb-3">{{ mcp.name }}</h2>
                <p class="text-gray-200 mb-5 line-clamp-2 text-sm">{{ mcp.description }}</p>
                <button
                  @click="installMcp(mcp.id)"
                  class="mac-feature-button"
                >
                  {{ mcp.installed ? 'Installed' : 'Install Now' }}
                </button>
              </div>
            </div>
          </transition-group>

          <!-- Carousel controls -->
          <button 
            @click="prevSlide"
            class="mac-carousel-control left"
          >
            <ChevronLeftIcon class="h-5 w-5 text-white" />
          </button>
          <button 
            @click="nextSlide"
            class="mac-carousel-control right"
          >
            <ChevronRightIcon class="h-5 w-5 text-white" />
          </button>

          <!-- Carousel indicators -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
            <button
              v-for="(_, index) in featuredMcps"
              :key="index"
              @click="currentSlide = index"
              class="w-1.5 h-1.5 rounded-full transition-colors"
              :class="currentSlide === index ? 'bg-white' : 'bg-white/50'"
            />
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div v-if="!loading" class="space-y-12">
        <!-- Server MCPs -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-medium text-gray-900 dark:text-white">Server MCPs</h2>
            <button class="mac-view-button">
              <span>View all</span>
              <ArrowRightIcon class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="mcp in serverMcps" :key="mcp.id"
                 class="group mac-card server">
              <div class="p-5">
                <div class="flex items-start">
                  <div class="mac-icon from-purple-500/90 to-indigo-600/90">
                    <img :src="mcp.icon" :alt="mcp.name" class="w-7 h-7 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ mcp.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ mcp.developer }}</p>
                    <div class="flex items-center mt-1">
                      <div class="flex text-yellow-400">
                        <span v-for="i in 5" :key="i" class="text-xs">★</span>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">{{ mcp.rating }}</span>
                    </div>
                  </div>
                </div>
                <p class="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ mcp.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ mcp.downloads.toLocaleString() }} downloads
                  </span>
                  <button @click="installMcp(mcp.id)"
                          :disabled="mcp.installed"
                          class="mac-button server">
                    {{ mcp.installed ? 'Installed' : 'Install' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Tools MCPs -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-medium text-gray-900 dark:text-white">Tools</h2>
            <button class="mac-view-button">
              <span>View all</span>
              <ArrowRightIcon class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="mcp in toolsMcps" :key="mcp.id"
                 class="group mac-card tool">
              <div class="p-5">
                <div class="flex items-start">
                  <div class="mac-icon from-blue-500/90 to-cyan-600/90">
                    <img :src="mcp.icon" :alt="mcp.name" class="w-7 h-7 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ mcp.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ mcp.developer }}</p>
                    <div class="flex items-center mt-1">
                      <div class="flex text-yellow-400">
                        <span v-for="i in 5" :key="i" class="text-xs">★</span>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">{{ mcp.rating }}</span>
                    </div>
                  </div>
                </div>
                <p class="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ mcp.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ mcp.downloads.toLocaleString() }} downloads
                  </span>
                  <button @click="installMcp(mcp.id)"
                          :disabled="mcp.installed"
                          class="mac-button tool">
                    {{ mcp.installed ? 'Installed' : 'Install' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Client MCPs -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-medium text-gray-900 dark:text-white">Client MCPs</h2>
            <button class="mac-view-button">
              <span>View all</span>
              <ArrowRightIcon class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="mcp in clientMcps" :key="mcp.id"
                 class="group mac-card client">
              <div class="p-5">
                <div class="flex items-start">
                  <div class="mac-icon from-green-500/90 to-emerald-600/90">
                    <img :src="mcp.icon" :alt="mcp.name" class="w-7 h-7 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ mcp.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ mcp.developer }}</p>
                    <div class="flex items-center mt-1">
                      <div class="flex text-yellow-400">
                        <span v-for="i in 5" :key="i" class="text-xs">★</span>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">{{ mcp.rating }}</span>
                    </div>
                  </div>
                </div>
                <p class="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ mcp.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ mcp.downloads.toLocaleString() }} downloads
                  </span>
                  <button @click="installMcp(mcp.id)"
                          :disabled="mcp.installed"
                          class="mac-button client">
                    {{ mcp.installed ? 'Installed' : 'Install' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="mac-spinner"></div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mac-card {
  @apply bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-gray-100/80 dark:border-gray-700/50 transition-all hover:translate-y-[-1px] backdrop-blur-sm overflow-hidden;
}

.mac-card:hover {
  @apply shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)];
}

.mac-card.server:hover {
  @apply border-[#2356f6]/10 dark:border-[#2356f6]/20;
}

.mac-card.tool:hover {
  @apply border-[#2356f6]/10 dark:border-[#2356f6]/20;
}

.mac-card.client:hover {
  @apply border-[#2356f6]/10 dark:border-green-700/30;
}

.mac-icon {
  @apply w-9 h-9 rounded-lg bg-[#2356f6] flex items-center justify-center mr-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)];
}

.mac-icon img {
  @apply w-5 h-5;
}

.mac-button {
  @apply px-3 py-1 rounded-md text-[11px] font-medium transition-all focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#2356f6]/30;
}

.mac-button:not(:disabled) {
  @apply bg-[#2356f6] text-white hover:bg-[#2356f6]/90 active:bg-[#2356f6]/80;
}

.mac-button:disabled {
  @apply bg-gray-100 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed;
}

.mac-button.server:not(:disabled) {
  @apply bg-[#2356f6] hover:bg-[#2356f6]/90 active:bg-[#2356f6]/80;
}

.mac-button.tool:not(:disabled) {
  @apply bg-[#2356f6] hover:bg-[#2356f6]/90 active:bg-[#2356f6]/80;
}

.mac-button.client:not(:disabled) {
  @apply bg-[#2356f6] hover:bg-[#2356f6]/90 active:bg-[#2356f6]/80;
}

.mac-feature-button {
  @apply px-3.5 py-1 rounded-md text-[11px] font-medium bg-white/90 text-[#2356f6] shadow-sm hover:bg-white hover:shadow-md active:bg-gray-50 transition-all focus:outline-none focus:ring-1 focus:ring-[#2356f6]/30 focus:ring-offset-1;
}

.mac-view-button {
  @apply text-[#2356f6] hover:text-[#2356f6]/80 flex items-center space-x-1.5 transition-colors px-2 py-0.5 rounded-md hover:bg-[#2356f6]/5 dark:hover:bg-[#2356f6]/10 font-medium text-[11px];
}

.mac-carousel-control {
  @apply absolute top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-lg bg-black/10 hover:bg-black/20 active:bg-black/30 transition-colors backdrop-blur-sm;
}

.mac-carousel-control.left {
  @apply left-4;
}

.mac-carousel-control.right {
  @apply right-4;
}

.mac-spinner {
  @apply animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-[#2356f6];
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* 修改搜索框样式 */
input[type="text"] {
  @apply bg-white/95 dark:bg-gray-800/95 border border-gray-200/80 dark:border-gray-700/50 text-[13px];
  @apply focus:ring-1 focus:ring-[#2356f6]/30 focus:border-[#2356f6]/30;
  @apply placeholder-gray-400 dark:placeholder-gray-500;
  @apply shadow-[0_1px_2px_rgba(0,0,0,0.04)];
}

/* 修改卡片内容间距和排版 */
.mac-card > div {
  @apply p-4 space-y-2.5;
}

.mac-card h3 {
  @apply text-[13px] font-medium mb-0.5;
}

.mac-card p {
  @apply text-[11px] leading-relaxed;
}

.mac-card .text-sm {
  @apply text-[11px];
}

/* 修改评分样式 */
.flex.text-yellow-400 {
  @apply text-[#FFB800];
}

.flex.text-yellow-400 span {
  @apply text-[10px];
}

/* 修改下载量和评分数字样式 */
.text-gray-500, .text-xs {
  @apply text-[11px] font-medium;
}

/* 调整搜索图标大小 */
.MagnifyingGlassIcon {
  @apply h-4 w-4 !important;
}

/* 调整其他图标大小 */
.ArrowRightIcon {
  @apply w-3 h-3 !important;
}
</style> 