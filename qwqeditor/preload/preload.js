const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("electronAPI",{
    minimizeWindow: () => ipcRenderer.send("minimize-window"),
    maximizeWindow: () => ipcRenderer.send("maximize-window"),
    closeWindow: () => ipcRenderer.send("close-window"),
    onMaximized: (callback) => ipcRenderer.on("window-maximized", callback),
    onUnMaximized: (callback) => ipcRenderer.on("window-unmaximized", callback),
    openPDFDialog: () => ipcRenderer.invoke('dialog:openPDF'),

    // 添加新方法，打开文件夹选择对话框
    selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),

});


