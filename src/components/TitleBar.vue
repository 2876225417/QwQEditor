<template>
  <div class="title-bar">
    <img src="../assets/qwqeditor.png" alt="App Icon" class="title-icon"/>
<!--    <label class="theme-toggle">-->
<!--      <input type="checkbox" id="toggle-theme">-->
<!--      <span class="slider-bar"></span>-->
<!--    </label>-->

    <div class="language-selector">
      <img src="../assets/language1.png" alt="语言">
      <select id="languageSelect">
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
    </div>

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
/* 主题切换胶囊样式 */
.theme-toggle {
  -webkit-app-region: no-drag;
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}
.theme-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  -webkit-app-region: no-drag;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 30px;
  transition: background-color 0.4s;
}
.slider::before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.4s;
}
input:checked + .slider {
  background-color: #333;
}
input:checked + .slider::before {
  transform: translateX(30px);
}

/* 标题栏样式 */
.title-bar {
  width: 100%;
  height: 40px;
  background: linear-gradient(145deg, #ffffff, #d1d9e6);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  -webkit-app-region: drag;
  top: 0;
  z-index: 1000;
}
body.dark-mode .title-bar {
  background: linear-gradient(145deg, #3c3f41, #2b2c2e);
}
.title-icon {
  -webkit-app-region: drag;
}
.title-icon {
  height: 24px;
  width: 24px;
  margin-right: 10px;
}

#service-arrow{
  padding-left: 10px;
  display: flex;
}

.title-buttons {
  display: flex;
  gap: 8px;
}

.title-bar-buttons{
  margin-left: auto;
  padding-right: 20px
}

.title-bar button {
  -webkit-app-region: no-drag;
  background: #444;
  border: none;
  color: white;
  font-size: 14px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}
.title-bar button:hover {
  transform: scale(1.1);
}
.title-bar button:active {
  transform: scale(1.05);
  background-color: #333;
  filter: brightness(1.2);
}
#minimize-btn:hover { background: #3a8ec0; }
#maximize-btn:hover { background: #4caf50; }
#close-btn:hover { background: #e74c3c; }
body.dark-mode #minimize-btn:hover { background: #3a8ec0; }
body.dark-mode #maximize-btn:hover { background: #4caf50; }
body.dark-mode #close-btn:hover { background: #e7ec3c; }
body.dark-mode .title-bar button:active {
  background-color: #555;
  filter: brightness(1.1);
}

/* 语言选择器样式 */
.language-selector {
  padding-left: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  -webkit-app-region: no-drag;
}
.language-selector label {
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}
.language-selector select {
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  color: #333;
  transition: all 0.3s ease;
  outline: none;
  cursor: pointer;
}

body.dark-mode .language-selector select{
  background-color: #444;
  color: #ddd;
  border: 1px solid #555;
}

.language-selector select:hover{
  border-color: #888;
}

.language-selector select:focus{
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}


.language-selector img {
  padding-right: 10px;
  -webkit-app-region: drag;
  height: 30px;
  width: 30px;
  transition: color 0.5s ease-in-out;
}



.title-icon{
  height: 30px;
  width: 30px;
}

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
