<template>
  <div>
    <h1>File Tree Viewer</h1>
    <button @click="selectDirectory">Select Directory</button>
    <p>{{ message }}</p>
    <div v-if="fileTree">
      <pre>{{ JSON.stringify(fileTree, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
const isDev = process.env.NODE_ENV === "development";
const path = require('path');
const { ipcRenderer } = require('electron');

let myAddon;
if (isDev) {
  // myAddon = require(path.resolve(__dirname, '../../../../../../src-electron/cppAddons/file_treev1.node'));
} else {
  // myAddon = require(path.join(process.resourcesPath, "build/Release/myaddon.node"));
}

export default {
  data() {
    return {
      message: "Click the button to select a directory and view the file tree.",
      fileTree: null
    };
  },
  methods: {
    async selectDirectory() {
      try {
        // 使用 IPC 调用主进程中的对话框
        const directoryPath = await ipcRenderer.invoke("dialog:openDirectory");
        if (directoryPath) {
          this.message = "Loading file tree, please wait...";
          this.getFileTree(directoryPath);
        } else {
          this.message = "No directory selected.";
        }
      } catch (err) {
        console.error("Failed to select directory:", err);
        this.message = "Failed to select directory.";
      }
    },
    async getFileTree(directoryPath) {
      try {
        // 调用 C++ 异步接口获取文件树
        // const tree = await myAddon.getFileTree(directoryPath);
        const tree = null;
        this.fileTree = tree;
        this.message = "File tree loaded successfully.";
      } catch (error) {
        console.error("Error getting file tree:", error);
        this.message = "Failed to load file tree.";
      }
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

p {
  font-size: 18px;
  margin: 5px 0;
}

pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
