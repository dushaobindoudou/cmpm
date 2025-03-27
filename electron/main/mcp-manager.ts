import { app, dialog } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as child_process from 'child_process'
import { promisify } from 'util'

const exec = promisify(child_process.exec)
const copyFile = promisify(fs.copyFile)
const mkdir = promisify(fs.mkdir)
const exists = promisify(fs.exists)
const unlink = promisify(fs.unlink)
const rmdir = promisify(fs.rmdir)

export interface McpInstallOptions {
  id: string
  name: string
  version: string
  filePath: string // Path to the downloaded file
  targetPath?: string // Optional specific target path
}

export interface McpUninstallOptions {
  id: string
  installPath: string
}

export class McpManager {
  private readonly basePath: string

  constructor() {
    // Create storage location for MCPs
    this.basePath = path.join(app.getPath('userData'), 'mcps')
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true })
    }
  }

  /**
   * Install an MCP from a file
   */
  async installMcp(options: McpInstallOptions): Promise<string> {
    try {
      const { id, name, version, filePath, targetPath } = options
      
      // For macOS, determine where to install based on the file type
      const fileExt = path.extname(filePath).toLowerCase()
      let installPath = targetPath || ''
      
      if (process.platform === 'darwin') {
        if (fileExt === '.app' || fileExt === '.dmg') {
          // Handle macOS .app bundles or .dmg files
          if (fileExt === '.dmg') {
            // Mount the DMG
            const { stdout } = await exec(`hdiutil attach "${filePath}"`)
            
            // Find the volume path
            const volumeMatch = /\/Volumes\/([^\r\n]+)/.exec(stdout)
            if (!volumeMatch) {
              throw new Error('Could not find mounted volume')
            }
            
            const volumePath = volumeMatch[0]
            
            // Find .app file in the volume
            const appFiles = fs.readdirSync(volumePath).filter(file => file.endsWith('.app'))
            if (appFiles.length === 0) {
              throw new Error('No .app file found in the DMG')
            }
            
            // Copy the .app to Applications
            const appPath = path.join(volumePath, appFiles[0])
            const targetAppPath = path.join('/Applications', appFiles[0])
            
            if (fs.existsSync(targetAppPath)) {
              fs.rmSync(targetAppPath, { recursive: true, force: true })
            }
            
            // Use cp instead of copyFile for directories
            await exec(`cp -R "${appPath}" "/Applications/"`)
            
            // Detach the DMG
            await exec(`hdiutil detach "${volumePath}"`)
            
            installPath = targetAppPath
          } else {
            // .app file, copy to Applications
            const appName = path.basename(filePath)
            const targetAppPath = path.join('/Applications', appName)
            
            if (fs.existsSync(targetAppPath)) {
              fs.rmSync(targetAppPath, { recursive: true, force: true })
            }
            
            // Use cp instead of copyFile for directories
            await exec(`cp -R "${filePath}" "/Applications/"`)
            
            installPath = targetAppPath
          }
        } else {
          // For other file types, store in user data dir
          const mcpDir = path.join(this.basePath, id)
          if (!await exists(mcpDir)) {
            await mkdir(mcpDir, { recursive: true })
          }
          
          const targetFile = path.join(mcpDir, path.basename(filePath))
          await copyFile(filePath, targetFile)
          installPath = targetFile
        }
      } else if (process.platform === 'win32') {
        // Windows-specific installation logic would go here
        // ...
      } else {
        // Linux-specific installation logic would go here
        // ...
      }
      
      // Store installation info
      this.saveInstallInfo(id, { 
        id, 
        name, 
        version, 
        installPath,
        installedAt: new Date().toISOString()
      })
      
      return installPath
    } catch (error) {
      console.error('Error installing MCP:', error)
      throw error
    }
  }

  /**
   * Uninstall an MCP
   */
  async uninstallMcp(options: McpUninstallOptions): Promise<void> {
    try {
      const { id, installPath } = options
      
      if (process.platform === 'darwin') {
        if (installPath.startsWith('/Applications') && installPath.endsWith('.app')) {
          // Remove .app from Applications
          if (await exists(installPath)) {
            await exec(`rm -rf "${installPath}"`)
          }
        } else {
          // Remove from user data dir
          if (await exists(installPath)) {
            await unlink(installPath)
          }
          
          // Clean up MCP directory if empty
          const mcpDir = path.join(this.basePath, id)
          if (await exists(mcpDir)) {
            const files = fs.readdirSync(mcpDir)
            if (files.length === 0) {
              await rmdir(mcpDir)
            }
          }
        }
      } else if (process.platform === 'win32') {
        // Windows-specific uninstallation logic would go here
        // ...
      } else {
        // Linux-specific uninstallation logic would go here
        // ...
      }
      
      // Remove installation info
      this.removeInstallInfo(id)
    } catch (error) {
      console.error('Error uninstalling MCP:', error)
      throw error
    }
  }

  /**
   * Get installation information for an MCP
   */
  getInstallInfo(id: string): any {
    const infoPath = path.join(this.basePath, `${id}.json`)
    if (fs.existsSync(infoPath)) {
      const data = fs.readFileSync(infoPath, 'utf8')
      return JSON.parse(data)
    }
    return null
  }

  /**
   * Save installation information for an MCP
   */
  private saveInstallInfo(id: string, info: any): void {
    const infoPath = path.join(this.basePath, `${id}.json`)
    fs.writeFileSync(infoPath, JSON.stringify(info, null, 2), 'utf8')
  }

  /**
   * Remove installation information for an MCP
   */
  private removeInstallInfo(id: string): void {
    const infoPath = path.join(this.basePath, `${id}.json`)
    if (fs.existsSync(infoPath)) {
      fs.unlinkSync(infoPath)
    }
  }
} 