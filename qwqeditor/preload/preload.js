const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("electronAPI",{
    minimizeWindow: () => ipcRenderer.send("minimize-window"),
    maximizeWindow: () => ipcRenderer.send("maximize-window"),
    closeWindow: () => ipcRenderer.send("close-window"),
    // onMaximized: (callback) => ipcRenderer.on("window-maximized", callback),
    // onUnMaximized: (callback) => ipcRenderer.on("window-unmaximized", callback),

})

