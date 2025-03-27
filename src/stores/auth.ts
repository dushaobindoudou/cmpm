import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },
  
  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
    },
    
    setToken(token: string) {
      this.token = token
    },
    
    login(email: string, password: string) {
      // Here would be the API call to authenticate
      // For now, mocking the login process
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const mockUser = {
            id: 1,
            email,
            name: 'Mock User'
          }
          this.setUser(mockUser)
          this.setToken('mock-token-' + Date.now())
          localStorage.setItem('user', JSON.stringify(mockUser))
          resolve()
        }, 500)
      })
    },
    
    register(name: string, email: string, password: string) {
      // Here would be the API call to register
      // For now, mocking the register process
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const mockUser = {
            id: 1,
            email,
            name
          }
          this.setUser(mockUser)
          this.setToken('mock-token-' + Date.now())
          localStorage.setItem('user', JSON.stringify(mockUser))
          resolve()
        }, 500)
      })
    },
    
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
    },
    
    forgotPassword(email: string) {
      // Mock password reset
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 500)
      })
    },
    
    // Initialize from localStorage if available
    init() {
      const userData = localStorage.getItem('user')
      if (userData) {
        this.setUser(JSON.parse(userData))
        this.setToken('mock-token')
      }
    }
  },
  
  // Persist the store
  persist: {
    storage: localStorage,
    paths: ['token']
  }
}) 