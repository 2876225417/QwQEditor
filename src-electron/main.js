// src-electron/main.js
const { app, BrowserWindow, ipcMain, nativeTheme} = require('electron')
const { join } = require('path')

// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建浏览器窗口时，调用这个函数。
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        backgroundMaterial: "acrylic",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    // win.loadURL('http://localhost:3000')
    // development模式
    if(process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        // 开启调试台
        win.webContents.openDevTools()
    }else {
        win.loadFile(join(__dirname, '../dist/index.html'))
    }


    win.on("maximize", () => {
        win.webContents.send("window-maximized");
    });

    win.on("unmaximize", () => {
        win.webContents.send("window-unmaximized");
    });

    // 窗口控制：监听来自渲染进程的事件
    ipcMain.on('window-control', (event, action) => {
        if (action === 'minimize') win.minimize()
        if (action === 'maximize') win.isMaximized() ? win.unmaximize() : win.maximize()
        if (action === 'close') win.close()
    })

    // 进入应用后初始化应用主题
    win.webContents.on("did-finish-load", () => {
        const isDarkMode = nativeTheme.shouldUseDarkColors;
        win.webContents.send("initial-theme", isDarkMode);
    })
}

// Electron 会在初始化后并准备
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
