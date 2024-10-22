const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("electronAPI",{
    toggleDevTools: () => ipcRenderer.send("toggle-dev-tools")
})

