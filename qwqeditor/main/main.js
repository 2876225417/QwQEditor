

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path")

function createWindows(){
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false, // 隐藏边框
        webPreferences:{
            preload: path.join(__dirname, "../preload/preload.js"),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile(path.join(__dirname, "../renderer/index.html"));

    ipcMain.on("message-from-renderer", (event, arg) => {
        console.log(arg);
        event.reply("reply-from-main", "Message received");
    });
}

app.whenReady().then(() => {
    createWindows();

});

app.on("window-all-closed", () =>{
    if(process.platform !== "darwin"){
        app.quit();
    }
})
