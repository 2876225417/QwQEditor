

const { app,
    BrowserWindow,
    ipcMain,
    globalShortcut ,
    dialog}
    = require("electron");

const path = require("path")
const fs = require('fs');
let mainWin;

function createWindows(){
    mainWin = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false, // 禁用 Electron 默认框架
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


}

console.log('Current working directory:', __dirname);

// 打开文件对话框并返回文件路径
// 处理文件对话框
ipcMain.handle('dialog:openPDF', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
    });
    if (canceled) {
        return null;
    } else {
        return filePaths[0];
    }
});


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