import { app, BrowserWindow, shell, ipcMain, Menu, dialog, Tray, nativeTheme } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { McpManager } from './mcp-manager'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
let tray: Tray | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

// MCP Manager instance
const mcpManager = new McpManager()

async function createWindow() {
  win = new BrowserWindow({
    title: 'MCP Management Platform',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width: 1100,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#fbfbfd', // macOS light background
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
    // macOS specific
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 10, y: 10 },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  
  // Create menu for macOS
  createMenu()
  
  // Create tray icon
  createTray()
}

// Create native macOS menu
function createMenu() {
  const isMac = process.platform === 'darwin'
  
  const template = [
    // App menu (macOS only)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // File menu
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    // Help menu
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template as any)
  Menu.setApplicationMenu(menu)
}

// Create system tray icon
function createTray() {
  if (process.platform === 'darwin') {
    const icon = path.join(process.env.VITE_PUBLIC, 'tray-icon.png')
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show CMPM', click: () => win?.show() },
      { label: 'Quit', click: () => app.quit() }
    ])
    tray.setToolTip('CMPM - MCP Management Platform')
    tray.setContextMenu(contextMenu)
    
    tray.on('click', () => {
      win?.show()
    })
  }
}

// Handle IPC messages from renderer process
ipcMain.handle('get-app-path', () => app.getPath('userData'))

ipcMain.handle('get-platform', () => process.platform)

ipcMain.handle('get-system-theme', () => nativeTheme.shouldUseDarkColors ? 'dark' : 'light')

ipcMain.handle('set-auto-launch', (_, enable: boolean) => {
  app.setLoginItemSettings({
    openAtLogin: enable,
    openAsHidden: true
  })
})

ipcMain.handle('show-notification', (_, { title, body }) => {
  if (process.platform === 'darwin') {
    // We would add functionality here to display native macOS notifications
    return
  }
})

// Create IPC handlers for MCP operations
ipcMain.handle('mcp:install', async (_, options) => {
  try {
    const installPath = await mcpManager.installMcp(options)
    return { success: true, installPath }
  } catch (error) {
    console.error('Failed to install MCP:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('mcp:uninstall', async (_, options) => {
  try {
    await mcpManager.uninstallMcp(options)
    return { success: true }
  } catch (error) {
    console.error('Failed to uninstall MCP:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('mcp:getInstallInfo', (_, id) => {
  return mcpManager.getInstallInfo(id)
})

ipcMain.handle('mcp:openInstalled', async (_, path) => {
  if (process.platform === 'darwin' && path.endsWith('.app')) {
    try {
      await shell.openPath(path)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  } else {
    const result = shell.openPath(path)
    return { success: result === '' }
  }
})

ipcMain.handle('mcp:selectInstallLocation', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select Installation Location'
  })
  
  if (canceled) {
    return { success: false, canceled: true }
  }
  
  return { success: true, path: filePaths[0] }
})

ipcMain.handle('mcp:downloadFile', async (_, { url, destination }) => {
  try {
    // Implement download logic here (could use electron-dl or custom solution)
    // This is just a placeholder
    return { success: true, path: destination }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// Clean up tray icon when app is quitting
app.on('before-quit', () => {
  if (tray) {
    tray.destroy()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
