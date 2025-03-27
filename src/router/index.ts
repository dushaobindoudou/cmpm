import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// Define routes
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'auth',
    component: () => import('../views/auth/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('../views/auth/LoginView.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/auth/RegisterView.vue')
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('../views/auth/ForgotPasswordView.vue')
      }
    ]
  },
  {
    path: '/app',
    name: 'app',
    component: () => import('../views/app/AppLayout.vue'),
    redirect: '/app/discover',
    children: [
      {
        path: 'discover',
        name: 'discover',
        component: () => import('../views/app/DiscoverView.vue')
      },
      {
        path: 'categories/:category',
        name: 'category',
        component: () => import('../views/app/CategoryView.vue')
      },
      {
        path: 'mcp/:id',
        name: 'mcp-detail',
        component: () => import('../views/app/McpDetailView.vue')
      },
      {
        path: 'library',
        name: 'library',
        component: () => import('../views/app/LibraryView.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../views/app/ProfileView.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/app/SettingsView.vue')
      }
    ],
    meta: { requiresAuth: true }
  }
]

// Create router
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  // For now, we'll use localStorage to check if user is logged in
  const isAuthenticated = localStorage.getItem('user') !== null
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'discover' })
  } else {
    next()
  }
})

export default router 