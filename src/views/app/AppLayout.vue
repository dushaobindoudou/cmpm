<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useSettingsStore } from '../../stores/settings'
import { 
  HomeIcon, 
  CubeIcon,
  WrenchIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const searchQuery = ref('')

interface NavItem {
  name: string
  route?: RouteLocationRaw
  icon: any
  description: string
  children?: { 
    name: string
    route: RouteLocationRaw
    description: string 
  }[]
  action?: () => void
}

const navItems: NavItem[] = [
  { 
    name: 'Discover', 
    route: '/app/discover', 
    icon: HomeIcon,
    description: 'Browse and discover new MCPs'
  },
  { 
    name: 'Library', 
    route: '/app/library', 
    icon: CubeIcon,
    description: 'Manage your installed MCPs'
  },
  { 
    name: 'Tools', 
    route: '/app/tools', 
    icon: WrenchIcon,
    description: 'Access MCP management tools',
    children: [
      { name: 'Environment', route: '/app/tools/environment', description: 'Configure environment variables' },
      { name: 'Integration', route: '/app/tools/integration', description: 'Manage client integrations' }
    ]
  },
  { 
    name: 'Analytics', 
    route: '/app/analytics', 
    icon: ChartBarIcon,
    description: 'View usage statistics and reports'
  }
]

const bottomNavItems: NavItem[] = [
  { 
    name: 'Settings', 
    route: '/app/settings', 
    icon: Cog6ToothIcon,
    description: 'Configure application settings'
  },
  { 
    name: 'Help', 
    route: '/app/help', 
    icon: QuestionMarkCircleIcon,
    description: 'Get help and documentation'
  },
  { 
    name: 'Logout', 
    icon: ArrowRightOnRectangleIcon,
    action: () => authStore.logout(),
    description: 'Sign out of your account'
  }
]

const handleNavigation = (item: NavItem) => {
  if (item.action) {
    item.action()
  } else if (item.route) {
    router.push(item.route)
  }
}

const isActive = (item: NavItem) => {
  if (!item.route) return false
  return route.path.startsWith(item.route.toString())
}

const expandedItems = ref<string[]>([])

const toggleExpand = (name: string) => {
  const index = expandedItems.value.indexOf(name)
  if (index === -1) {
    expandedItems.value.push(name)
  } else {
    expandedItems.value.splice(index, 1)
  }
}

const isExpanded = (name: string) => expandedItems.value.includes(name)
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <nav class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <img src="/logo.svg" alt="CMPM" class="h-8" />
        </div>

        <!-- Search Box -->
        <div class="p-4 border-gray-200 dark:border-gray-700">
          <div class="relative">
            <MagnifyingGlassIcon class="h-4 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
            <input
              type="text"
              v-model="searchQuery"class="w-full pl-9 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition shadow-sm hover:shadow"
              placeholder="Search MCPs..."
            />
          </div>
        </div>

        <!-- Main navigation -->
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
          <div v-for="item in navItems" :key="item.name" class="space-y-1">
            <button
              class="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors"
              :class="[
                isActive(item) 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                item.children ? 'justify-between' : ''
              ]"
              @click="item.children ? toggleExpand(item.name) : handleNavigation(item)"
            >
              <div class="flex items-center space-x-3">
                <component :is="item.icon" class="w-5 h-5" />
                <span>{{ item.name }}</span>
              </div>
              <svg 
                v-if="item.children"
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-90': isExpanded(item.name) }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Submenu -->
            <div 
              v-if="item.children && isExpanded(item.name)"
              class="ml-8 space-y-1"
            >
              <button
                v-for="child in item.children"
                :key="child.name"
                class="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors"
                :class="[
                  route.path === child.route 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
                @click="router.push(child.route)"
              >
                {{ child.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom navigation -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            v-for="item in bottomNavItems"
            :key="item.name"
            class="w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors"
            :class="[
              isActive(item)
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            @click="handleNavigation(item)"
          >
            <div class="flex items-center space-x-3">
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
            </div>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div class="pt-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-view-enter-active,
.router-view-leave-active {
  transition: opacity 0.2s ease;
}

.router-view-enter-from,
.router-view-leave-to {
  opacity: 0;
}
</style> 