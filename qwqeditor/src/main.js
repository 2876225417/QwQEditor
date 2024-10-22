


const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")

function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true
        },
    });


    win.loadFile('./qwqEditor/src/index.html');

    ipcMain.on("toggle-dev-tools", () => {
        win.webContents.openDevTools();
        if(win.webContents.isDevToolsOpened()){
            win.webContents.closeDevTools();
        }else{
            win.webContents.openDevTools();
        }
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed",() => {
    if(process.platform !== "darwin"){
        app.quit();
    }
})