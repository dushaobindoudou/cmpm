/**
 * TypeScript definitions for Electron APIs
 * These interfaces serve as contracts between main and renderer processes
 */

interface McpInstallOptions {
  id: string
  name: string
  version: string
  filePath: string
  targetPath?: string
}

interface McpUninstallOptions {
  id: string
  installPath: string
}

interface CmpmApi {
  // System information
  getAppPath: () => Promise<string>
  getPlatform: () => Promise<string> 
  getSystemTheme: () => Promise<'light' | 'dark'>
  
  // System integration
  setAutoLaunch: (enable: boolean) => Promise<boolean>
  
  // Notifications
  showNotification: (options: { title: string, body: string }) => Promise<void>
  
  // MCP Management
  mcpManager: {
    install: (options: McpInstallOptions) => Promise<{ success: boolean, installPath?: string, error?: string }>
    uninstall: (options: McpUninstallOptions) => Promise<{ success: boolean, error?: string }>
    getInstallInfo: (id: string) => Promise<any>
    openInstalled: (path: string) => Promise<{ success: boolean, error?: string }>
    selectInstallLocation: () => Promise<{ success: boolean, path?: string, canceled?: boolean }>
    downloadFile: (url: string, destination: string) => Promise<{ success: boolean, path?: string, error?: string }>
  }
}

declare global {
  interface Window {
    cmpm: CmpmApi
  }
}

export {}; 