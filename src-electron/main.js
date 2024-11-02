// src-electron/main.js
const {
    app,
    BrowserWindow,
    ipcMain,
    nativeTheme,
    dialog
} = require('electron')
const { join } = require('path')
const https = require("https");
const fs=  require("fs");
const path = require("path");
const axios = require("axios");
const myAddon = require("../build/Release/myaddon.node")

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
    });

    // 打开文件资源管理器
    ipcMain.handle("dialog:openDirectory", async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'],
        });
        return result.filePaths[0];
    });

    // 监听下载事件
    ipcMain.on('start-download', async (event, { url, filename, downloadPath }) => {
        const filePath = `${downloadPath}/${filename}.pdf`;
        const writer = fs.createWriteStream(filePath);

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const totalLength = response.headers['content-length'];
        let downloadedLength = 0;

        response.data.on('data', (chunk) => {
            downloadedLength += chunk.length;
            const progress = Math.round((downloadedLength / totalLength) * 100);
            event.sender.send(`download-progress-${filename}`, progress);
        });

        response.data.pipe(writer);

        writer.on('finish', () => {
            event.sender.send(`download-success-${filename}`);
        });

        writer.on('error', (err) => {
            event.sender.send(`download-failure-${filename}`, err.message);
        });
    });

    ipcMain.handle('read-file-tree', async (event, directoryPath) => {
        const readDirectory = (dirPath) => {
            const items = fs.readdirSync(dirPath);
            return items.map(item => {
                const fullPath = path.join(dirPath, item);
                const stats = fs.statSync(fullPath);
                if (stats.isDirectory()) {
                    return {
                        name: item,
                        isFolder: true,
                        expanded: false, // 这里可以设置为 false，表示初始状态为折叠
                        children: readDirectory(fullPath) // 递归读取子目录
                    };
                } else if (stats.isFile() && item.endsWith('.pdf')) {
                    return {
                        name: item,
                        isFolder: false,
                    };
                }
            }).filter(item => item); // 过滤掉未定义的项
        };

        try {
            const fileTree = readDirectory(directoryPath);
            return fileTree;
        } catch (error) {
            console.error('Error reading directory:', error);
            return [];
        }
    });




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
