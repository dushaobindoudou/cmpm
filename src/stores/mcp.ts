import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSettingsStore } from './settings'

export interface McpCategory {
  id: string
  name: string
  icon: string
}

export interface McpVersion {
  version: string
  releaseDate: string
  changes: string[]
}

export interface McpReview {
  id: number
  userId: number
  userName: string
  rating: number
  comment: string
  date: string
}

export interface Mcp {
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
  versions: McpVersion[]
  currentVersion: string
  downloads: number
  installed: boolean
  installPath?: string
  lastUpdated: string
  type: 'client' | 'server' | 'tool'
}

interface McpState {
  mcps: Mcp[]
  categories: McpCategory[]
  installedMcps: string[]
  featuredMcps: string[]
  loading: boolean
  error: string | null
}

export const useMcpStore = defineStore('mcp', {
  state: (): McpState => ({
    mcps: [],
    categories: [
      { id: 'productivity', name: 'Productivity', icon: 'lightning-bolt' },
      { id: 'development', name: 'Development', icon: 'code' },
      { id: 'education', name: 'Education', icon: 'academic-cap' },
      { id: 'creativity', name: 'Creativity', icon: 'sparkles' },
      { id: 'ai', name: 'AI & ML', icon: 'chip' }
    ],
    installedMcps: [],
    featuredMcps: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getMcpById: (state) => (id: string) => {
      return state.mcps.find(mcp => mcp.id === id)
    },
    
    getInstalledMcps: (state) => {
      return state.mcps.filter(mcp => state.installedMcps.includes(mcp.id))
    },
    
    getMcpsByCategory: (state) => (categoryId: string) => {
      return state.mcps.filter(mcp => mcp.categories.includes(categoryId))
    },
    
    getFeaturedMcps: (state) => {
      return state.mcps.filter(mcp => state.featuredMcps.includes(mcp.id))
    },
    
    getServerMcps(state) {
      return state.mcps.filter(mcp => mcp.type === 'server')
    },
    
    getToolMcps(state) {
      return state.mcps.filter(mcp => mcp.type === 'tool')
    },
    
    getClientMcps(state) {
      return state.mcps.filter(mcp => mcp.type === 'client')
    }
  },
  
  actions: {
    async fetchMcps() {
      this.loading = true
      try {
        // In a real application, you would fetch from an API
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.mcps = [
          {
            id: 'nginx-server',
            name: 'Nginx Server',
            description: 'High-performance HTTP server and reverse proxy with low resource consumption',
            icon: '/icons/nginx.png',
            screenshots: ['/screenshots/nginx1.png', '/screenshots/nginx2.png'],
            developer: 'Nginx, Inc.',
            categories: ['development', 'productivity'],
            tags: ['web server', 'proxy', 'load balancer'],
            rating: 4.8,
            reviewCount: 2543,
            versions: [
              {
                version: '1.20.2',
                releaseDate: '2023-03-15',
                changes: ['Security improvements', 'Performance optimizations']
              }
            ],
            currentVersion: '1.20.2',
            downloads: 1500000,
            installed: false,
            lastUpdated: '2023-03-15',
            type: 'server'
          },
          {
            id: 'postgresql',
            name: 'PostgreSQL',
            description: 'Advanced open-source relational database with strong reliability and data integrity',
            icon: '/icons/postgresql.png',
            screenshots: ['/screenshots/postgresql1.png', '/screenshots/postgresql2.png'],
            developer: 'PostgreSQL Global Development Group',
            categories: ['development'],
            tags: ['database', 'sql', 'relational'],
            rating: 4.9,
            reviewCount: 3421,
            versions: [
              {
                version: '14.2',
                releaseDate: '2022-02-10',
                changes: ['Improved query performance', 'Better concurrency']
              }
            ],
            currentVersion: '14.2',
            downloads: 2000000,
            installed: false,
            lastUpdated: '2022-02-10',
            type: 'server'
          },
          {
            id: 'redis-cache',
            name: 'Redis Cache',
            description: 'In-memory data structure store used as database, cache, and message broker',
            icon: '/icons/redis.png',
            screenshots: ['/screenshots/redis1.png', '/screenshots/redis2.png'],
            developer: 'Redis Labs',
            categories: ['development', 'productivity'],
            tags: ['cache', 'nosql', 'in-memory'],
            rating: 4.7,
            reviewCount: 1998,
            versions: [
              {
                version: '6.2.6',
                releaseDate: '2021-11-01',
                changes: ['Memory efficiency improvements', 'Security fixes']
              }
            ],
            currentVersion: '6.2.6',
            downloads: 1200000,
            installed: true,
            installPath: '/usr/local/bin/redis',
            lastUpdated: '2021-11-01',
            type: 'server'
          },
          {
            id: 'vscode',
            name: 'Visual Studio Code',
            description: 'Lightweight yet powerful source code editor with support for many languages',
            icon: '/icons/vscode.png',
            screenshots: ['/screenshots/vscode1.png', '/screenshots/vscode2.png'],
            developer: 'Microsoft',
            categories: ['development', 'productivity'],
            tags: ['editor', 'IDE', 'development tools'],
            rating: 4.8,
            reviewCount: 5432,
            versions: [
              {
                version: '1.67.0',
                releaseDate: '2022-05-05',
                changes: ['Performance improvements', 'New extensions API']
              }
            ],
            currentVersion: '1.67.0',
            downloads: 5000000,
            installed: true,
            installPath: '/Applications/Visual Studio Code.app',
            lastUpdated: '2022-05-05',
            type: 'client'
          },
          {
            id: 'slack',
            name: 'Slack',
            description: 'Business communication platform for teams with channels, direct messaging, and integrations',
            icon: '/icons/slack.png',
            screenshots: ['/screenshots/slack1.png', '/screenshots/slack2.png'],
            developer: 'Slack Technologies',
            categories: ['productivity'],
            tags: ['communication', 'team collaboration', 'messaging'],
            rating: 4.6,
            reviewCount: 4210,
            versions: [
              {
                version: '4.24.0',
                releaseDate: '2022-04-12',
                changes: ['UI improvements', 'Better notification control']
              }
            ],
            currentVersion: '4.24.0',
            downloads: 4500000,
            installed: false,
            lastUpdated: '2022-04-12',
            type: 'client'
          },
          {
            id: 'docker',
            name: 'Docker',
            description: 'Platform for developing, shipping, and running applications in containers',
            icon: '/icons/docker.png',
            screenshots: ['/screenshots/docker1.png', '/screenshots/docker2.png'],
            developer: 'Docker, Inc.',
            categories: ['development'],
            tags: ['container', 'virtualization', 'deployment'],
            rating: 4.9,
            reviewCount: 3876,
            versions: [
              {
                version: '20.10.14',
                releaseDate: '2022-03-23',
                changes: ['Security updates', 'Buildx improvements']
              }
            ],
            currentVersion: '20.10.14',
            downloads: 3000000,
            installed: true,
            installPath: '/usr/local/bin/docker',
            lastUpdated: '2022-03-23',
            type: 'tool'
          },
          {
            id: 'postman',
            name: 'Postman',
            description: 'API platform for building and using APIs with simplified steps',
            icon: '/icons/postman.png',
            screenshots: ['/screenshots/postman1.png', '/screenshots/postman2.png'],
            developer: 'Postman, Inc.',
            categories: ['development', 'productivity'],
            tags: ['api', 'testing', 'development tools'],
            rating: 4.7,
            reviewCount: 2564,
            versions: [
              {
                version: '9.15.0',
                releaseDate: '2022-01-20',
                changes: ['New request flow', 'Improved response viewer']
              }
            ],
            currentVersion: '9.15.0',
            downloads: 2800000,
            installed: false,
            lastUpdated: '2022-01-20',
            type: 'client'
          },
          {
            id: 'mongodb',
            name: 'MongoDB',
            description: 'Document-oriented NoSQL database used for high volume data storage',
            icon: '/icons/mongodb.png',
            screenshots: ['/screenshots/mongodb1.png', '/screenshots/mongodb2.png'],
            developer: 'MongoDB, Inc.',
            categories: ['development'],
            tags: ['database', 'nosql', 'document-oriented'],
            rating: 4.6,
            reviewCount: 2187,
            versions: [
              {
                version: '5.0.6',
                releaseDate: '2022-02-28',
                changes: ['Time series collections improvements', 'Security fixes']
              }
            ],
            currentVersion: '5.0.6',
            downloads: 1800000,
            installed: false,
            lastUpdated: '2022-02-28',
            type: 'server'
          },
          {
            id: 'git',
            name: 'Git',
            description: 'Distributed version control system for tracking changes in source code',
            icon: '/icons/git.png',
            screenshots: ['/screenshots/git1.png', '/screenshots/git2.png'],
            developer: 'Git Project',
            categories: ['development'],
            tags: ['version control', 'source control', 'development tools'],
            rating: 4.9,
            reviewCount: 4892,
            versions: [
              {
                version: '2.36.0',
                releaseDate: '2022-04-18',
                changes: ['Bug fixes', 'Performance improvements']
              }
            ],
            currentVersion: '2.36.0',
            downloads: 5500000,
            installed: true,
            installPath: '/usr/bin/git',
            lastUpdated: '2022-04-18',
            type: 'tool'
          },
          {
            id: 'kubernetes',
            name: 'Kubernetes',
            description: 'Container orchestration system for automating deployment, scaling, and management',
            icon: '/icons/kubernetes.png',
            screenshots: ['/screenshots/kubernetes1.png', '/screenshots/kubernetes2.png'],
            developer: 'Cloud Native Computing Foundation',
            categories: ['development'],
            tags: ['container orchestration', 'deployment', 'scaling'],
            rating: 4.8,
            reviewCount: 3125,
            versions: [
              {
                version: '1.23.5',
                releaseDate: '2022-03-16',
                changes: ['Security updates', 'Stability improvements']
              }
            ],
            currentVersion: '1.23.5',
            downloads: 2200000,
            installed: false,
            lastUpdated: '2022-03-16',
            type: 'tool'
          }
        ]
        
        this.featuredMcps = ['nginx-server', 'postgresql', 'redis-cache', 'vscode', 'slack']
        this.installedMcps = ['redis-cache', 'vscode', 'slack']
        
      } catch (error) {
        this.error = 'Failed to fetch MCPs'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    async getMcpInstallInfo(id: string) {
      if (!window.cmpm?.mcpManager) return null
      
      try {
        return await window.cmpm.mcpManager.getInstallInfo(id)
      } catch (error) {
        console.error('Failed to get MCP install info:', error)
        return null
      }
    },
    
    async downloadMcp(mcp: Mcp): Promise<string | null> {
      if (!window.cmpm?.mcpManager) {
        this.error = 'Electron API not available'
        return null
      }
      
      try {
        // In a real app, we would have a download URL
        // For now, we'll use a mock URL based on the MCP's properties
        const downloadUrl = `https://example.com/downloads/${mcp.id}-${mcp.currentVersion}.dmg`
        
        // Get app path for downloads
        const appPath = await window.cmpm.getAppPath()
        const downloadPath = `${appPath}/downloads/${mcp.id}-${mcp.currentVersion}.dmg`
        
        // Download the file
        const result = await window.cmpm.mcpManager.downloadFile(downloadUrl, downloadPath)
        if (!result.success) {
          throw new Error(result.error || 'Download failed')
        }
        
        return result.path || null
      } catch (error) {
        this.error = 'Failed to download MCP'
        console.error(error)
        return null
      }
    },
    
    async installMcp(id: string) {
      this.loading = true
      
      try {
        if (!window.cmpm?.mcpManager) {
          throw new Error('Electron API not available')
        }
        
        const mcp = this.getMcpById(id)
        if (!mcp) {
          throw new Error('MCP not found')
        }
        
        // Download the MCP
        const downloadPath = await this.downloadMcp(mcp)
        if (!downloadPath) {
          throw new Error('Download failed')
        }
        
        // Install the MCP
        const installResult = await window.cmpm.mcpManager.install({
          id: mcp.id,
          name: mcp.name,
          version: mcp.currentVersion,
          filePath: downloadPath
        })
        
        if (!installResult.success) {
          throw new Error(installResult.error || 'Installation failed')
        }
        
        // Update MCP status
        mcp.installed = true
        mcp.installPath = installResult.installPath
        
        // Add to installed list
        if (!this.installedMcps.includes(id)) {
          this.installedMcps.push(id)
        }
        
        // Show notification
        const settingsStore = useSettingsStore()
        if (settingsStore.notificationsEnabled) {
          window.cmpm.showNotification({
            title: 'Installation Complete',
            body: `${mcp.name} has been successfully installed.`
          })
        }
        
        return installResult
      } catch (error) {
        this.error = 'Failed to install MCP'
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async uninstallMcp(id: string) {
      this.loading = true
      
      try {
        if (!window.cmpm?.mcpManager) {
          throw new Error('Electron API not available')
        }
        
        const mcp = this.getMcpById(id)
        if (!mcp || !mcp.installPath) {
          throw new Error('MCP not found or not installed')
        }
        
        // Uninstall the MCP
        const uninstallResult = await window.cmpm.mcpManager.uninstall({
          id: mcp.id,
          installPath: mcp.installPath
        })
        
        if (!uninstallResult.success) {
          throw new Error(uninstallResult.error || 'Uninstallation failed')
        }
        
        // Update MCP status
        mcp.installed = false
        mcp.installPath = undefined
        
        // Remove from installed list
        this.installedMcps = this.installedMcps.filter(mcpId => mcpId !== id)
        
        // Show notification
        const settingsStore = useSettingsStore()
        if (settingsStore.notificationsEnabled) {
          window.cmpm.showNotification({
            title: 'Uninstallation Complete',
            body: `${mcp.name} has been successfully uninstalled.`
          })
        }
        
        return uninstallResult
      } catch (error) {
        this.error = 'Failed to uninstall MCP'
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async openInstalledMcp(id: string) {
      try {
        if (!window.cmpm?.mcpManager) {
          throw new Error('Electron API not available')
        }
        
        const mcp = this.getMcpById(id)
        if (!mcp || !mcp.installPath) {
          throw new Error('MCP not found or not installed')
        }
        
        const result = await window.cmpm.mcpManager.openInstalled(mcp.installPath)
        if (!result.success) {
          throw new Error(result.error || 'Failed to open MCP')
        }
        
        return result
      } catch (error) {
        this.error = 'Failed to open MCP'
        console.error(error)
        throw error
      }
    },
    
    async updateMcp(id: string) {
      this.loading = true
      
      try {
        if (!window.cmpm?.mcpManager) {
          throw new Error('Electron API not available')
        }
        
        const mcp = this.getMcpById(id)
        if (!mcp) {
          throw new Error('MCP not found')
        }
        
        // In a real app, we would check for updates and download the new version
        // For now, we'll simulate a version update
        
        // Just for demo purposes
        const newVersion = {
          version: parseFloat(mcp.currentVersion) + 0.1 + '',
          releaseDate: new Date().toISOString().split('T')[0],
          changes: ['Updated version', 'Bug fixes']
        }
        
        // Download the MCP
        const downloadPath = await this.downloadMcp({
          ...mcp,
          currentVersion: newVersion.version
        })
        
        if (!downloadPath) {
          throw new Error('Download failed')
        }
        
        // Uninstall the old version if needed
        if (mcp.installed && mcp.installPath) {
          await this.uninstallMcp(id)
        }
        
        // Install the new version
        const installResult = await window.cmpm.mcpManager.install({
          id: mcp.id,
          name: mcp.name,
          version: newVersion.version,
          filePath: downloadPath
        })
        
        if (!installResult.success) {
          throw new Error(installResult.error || 'Update installation failed')
        }
        
        // Update the MCP details
        mcp.versions.unshift(newVersion)
        mcp.currentVersion = newVersion.version
        mcp.lastUpdated = newVersion.releaseDate
        mcp.installed = true
        mcp.installPath = installResult.installPath
        
        // Ensure it's in the installed list
        if (!this.installedMcps.includes(id)) {
          this.installedMcps.push(id)
        }
        
        // Show notification
        const settingsStore = useSettingsStore()
        if (settingsStore.notificationsEnabled) {
          window.cmpm.showNotification({
            title: 'Update Complete',
            body: `${mcp.name} has been updated to version ${newVersion.version}.`
          })
        }
        
        return installResult
      } catch (error) {
        this.error = 'Failed to update MCP'
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    searchMcps(query: string) {
      if (!query) return this.mcps
      
      const lowercaseQuery = query.toLowerCase()
      return this.mcps.filter(mcp => 
        mcp.name.toLowerCase().includes(lowercaseQuery) ||
        mcp.description.toLowerCase().includes(lowercaseQuery) ||
        mcp.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    },
    
    getMcpsByType(type: 'client' | 'server' | 'tool') {
      return this.mcps.filter(mcp => mcp.type === type)
    }
  }
}) 