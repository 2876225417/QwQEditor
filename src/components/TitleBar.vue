<template>
  <div class="title-bar">
    <div class="title">My Electron App</div>

    <div class="window-controls">
      <button @click="windowControl('minimize')" aria-label="Minimize">−</button>
      <button @click="windowControl('maximize')" aria-label="Maximize">⬜</button>
      <button @click="windowControl('close')" aria-label="Close">×</button>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron')

export default {
  name: 'TitleBar',
  methods: {
    windowControl(action) {
      ipcRenderer.send('window-control', action)  // 发送控制命令给主进程
    }
  }
}
</script>

<style scoped>
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 8px 16px;
  -webkit-app-region: drag; /* 允许拖动 */
}

.window-controls button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  margin-left: 10px;
  cursor: pointer;
  -webkit-app-region: no-drag; /* 按钮区域不可拖动 */
}

.window-controls button:hover {
  color: red;
}
</style>
