


const {
    contextBridge,
    ipcRenderer
} = require('electron');


contextBridge.exposeInMainWorld('electron', {
    createPerson: (name, age) => ipcRenderer.invoke("create-person", name, age),
})
