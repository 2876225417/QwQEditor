

const { app,
    BrowserWindow,
    ipcMain,
    globalShortcut }
    = require("electron");

const path = require("path")

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

    mainWin.webContents.openDevTools();

    mainWin.loadFile(path.join(__dirname, "../renderer/index.html"));

    mainWin.on("closed", () => {
        mainWin = null;
    })

    globalShortcut.register("F12", () => {
        mainWin.webContents.toggleDevTools();
    })
}

app.whenReady().then(() => {
    createWindows();

    globalShortcut.register("F12", () => {
        mainWin.webContents.toggleDevTools();
    });
});

app.on("will-quit", () => {
    globalShortcut.unregisterAll();
})

ipcMain.on("minimize-window", () => {
    mainWin.minimize();
});

ipcMain.on("maximize-window", () => {
    if (mainWin.isMaximized()) {
        mainWin.unmaximize();
    }else{
        mainWin.maximize();
    }
});

ipcMain.on("close-window", () => {
    mainWin.close();
})

app.on("window-all-closed", () =>{
    if(process.platform !== "darwin"){
        app.quit();
    }
})
