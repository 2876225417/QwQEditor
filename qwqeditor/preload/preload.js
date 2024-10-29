const { contextBridge, ipcRenderer , nativeTheme} = require('electron')

contextBridge.exposeInMainWorld("electronAPI",{
    minimizeWindow: () => ipcRenderer.send("minimize-window"),
    maximizeWindow: () => ipcRenderer.send("maximize-window"),
    closeWindow: () => ipcRenderer.send("close-window"),
    onMaximized: (callback) => ipcRenderer.on("window-maximized", callback),
    onUnMaximized: (callback) => ipcRenderer.on("window-unmaximized", callback),
    openPDFDialog: () => ipcRenderer.invoke('dialog:openPDF'),

    // 添加新方法，打开文件夹选择对话框
    selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
    sendThemeToggle: () => ipcRenderer.send("toggle-dark-mode"),
    onThemeUpdate: (callback) => ipcRenderer.on("theme-updated", (event, isDarkMode) => {
        if(typeof callback === "function"){
            callback(isDarkMode);
        }
    }),
    onInitialTheme: (callback) => ipcRenderer.on("initial-theme", (event, isDarkMode) => callback(isDarkMode)),

    showNotification: (title, body) => {
        Notification.requestPermission().then(permission => {
            const notificationTitle = String(title);
            const notificationContent = String(body);

            new Notification(notificationTitle, {
                body: notificationContent,
            })
        });
    },

    autoNotification: () => {
        ipcRenderer.send("auto-notification", () => {
            const currentTime = new Date().toLocaleTimeString();
            window.electronAPI.showNotification("ppQwQqq", `事件${currentTime}`);
        })
    },
});



