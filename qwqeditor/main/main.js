

const { app,
    BrowserWindow,
    ipcMain,
    globalShortcut ,
    dialog,
    nativeTheme}
    = require("electron");

const path = require("path")
const fs = require('fs');
let mainWin;
let pdfWindow;





function createWindows(){
    mainWin = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false, // 禁用 Electron 默认框架
        // transparent: true,
        backgroundMaterial: "acrylic",
        webPreferences:{
            preload: path.join(__dirname, "../preload/preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: path.join(__dirname, "../assets/qwqeditor.png")
    });

    mainWin.on("maximize", () => {
        mainWin.webContents.send("window-maximized");
    });

    mainWin.on("unmaximize", () =>{
        mainWin.webContents.send("window-unmaximized");
    });

    mainWin.on("closed", () => {
        mainWin = null;
    });

    mainWin.loadFile(path.join(__dirname, "../renderer/index.html"));

    // pdfWindow.loadFile(path.join(__dirname, "../pdfjs/web/viewer.html"));

    mainWin.webContents.on("did-finish-load", () => {
        mainWin.webContents.send("initial-theme", nativeTheme.shouldUseDarkColors);
    })

}

console.log('Current working directory:', __dirname);


ipcMain.on("toggle-dark-mode", (event) => {
    nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? "light" : "dark";
    // 以下用来更新的特定的部分
    event.sender.send("theme-updated", nativeTheme.shouldUseDarkColors);
});



// 打开文件对话框并返回文件路径
// 处理文件对话框
// 处理文件夹选择对话框的请求
ipcMain.handle('dialog:selectFolder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const folderPath = result.filePaths[0];
        return readDirectory(folderPath);
    }
    return null;
});

// 递归读取目录内容
function readDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    return files.map(file => {
        const filePath = path.join(dirPath, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        return {
            name: file,
            path: filePath,
            isDirectory: isDirectory,
            children: isDirectory ? readDirectory(filePath) : []
        };
    });
}

// 注册快捷键
// ctrl + 1 -> 开启开发者面板
app.whenReady().then(() => {
    globalShortcut.register("Control + 1", () => {
        mainWin.webContents.toggleDevTools();
    });
}).then(createWindows);

// 界面关闭时，注销快捷键
app.on("will-quit", () => {
    globalShortcut.unregisterAll();
})

app.on("window-all-closed", () =>{
    if(process.platform !== "darwin"){
        app.quit();
    }
})

// 最小化窗口
ipcMain.on("minimize-window", () => {
    mainWin.minimize();
});

// 最大化窗口
ipcMain.on("maximize-window", () => {
    if (mainWin.isMaximized()) {
        mainWin.unmaximize();
    }else{
        mainWin.maximize();
    }
});

// 关闭窗口
ipcMain.on("close-window", () => {
    mainWin.close();
});