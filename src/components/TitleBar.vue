<template>
  <div class="title-bar">
    <img src="../assets/qwqeditor.png" alt="App Icon" class="title-icon"/>

    <div class="theme-switch" @click="onToggleTheme">
      <div :class="['toggle-circle', { 'toggle-circle-dark': isDarkMode }]"></div>
    </div>





    <div class="search-box">
      <input
          type="text"
          placeholder="search..."
          @keyup.enter="handleSearch"
          ref="searchInput"
      />
      <font-awesome-icon
          icon="fas fa-search"
          class="search-icon"
          @click="handleSearch"
      />
    </div>

    <div class="language-selector">
      <img src="../assets/language1.png" alt="语言">
      <select id="languageSelect" @change="onLanguageChange">
        <option value="en" :selected="language === 'en'">{{ $t('language') }}: English</option>
        <option value="zh" :selected="language === 'zh'">{{ $t('language')}}: 中文</option>
      </select>
    </div>




    <div class="window-controls">
      <button @click="windowControl('minimize')">
        <font-awesome-icon :icon="['fas', 'window-minimize']"/>
      </button>
      <button @click="toggleMaximize">
        <font-awesome-icon :icon="isMaximized ? ['fas', 'window-restore'] : ['fas', 'window-maximize']" />
      </button>
      <button @click="windowControl('close')">
        <font-awesome-icon :icon="['fas', 'window-close']" />
      </button>
    </div>


  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState, mapActions } from 'vuex';
import { saveConfig, getConfig } from '../indexedDB.js';

const { ipcRenderer } = require('electron')


export default {
  name: 'TitleBar',
  components: {FontAwesomeIcon},

  computed: {
    ...mapState([
      'isDarkMode',
      'language',
    ]),
  },


  data(){
    return {

      isMaximized: false,
    }
  },
  created(){
    getConfig('isDarkMode').then((value) => {
      if(value !== null){
        this.setTheme(value);
      } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(systemPrefersDark);
      }
      this.applyTheme();
    }).catch((error) => {
      console.log("Error reading theme configuration:", error);
    });

    getConfig("language").then((value) => {
      if(value){
        this.setLanguage(value);
        this.$i18n.locale = value;
      }
    }).catch((error) => {
      console.error("Error reading language configuration:", error);
    });

    ipcRenderer.on("window-maximized", () => {
      this.isMaximized = true;
    });
    ipcRenderer.on("window-unmaximized", () => {
      this.isMaximized = false;
    });
  },
  methods: {
    ...mapActions([
      "toggleTheme",
      "setTheme",
      "setLanguage",
    ]),

    onToggleTheme(){
      this.toggleTheme();
      saveConfig("isDarkMode", this.isDarkMode)
          .then(() => {
            console.log("Configuration save successfully");
          })
          .catch((error) => {
            console.log("Failed to save configuration:", error);
          });
      this.applyTheme();
    },

    onLanguageChange(event){
      const selectedLanguage = event.target.value;
      this.setLanguage(selectedLanguage);
      this.$i18n.locale = selectedLanguage;
      saveConfig("language", selectedLanguage)
          .then(() => {
            console.log("Language configuration save successfully");
          })
          .catch((error) => {
            console.error("Failed to save configuration:", error);
          });
    },

    applyTheme(){
      console.log("this", this.isDarkMode);
      document.body.classList.toggle("dark-mode", this.isDarkMode);
    },

    windowControl(action) {
      ipcRenderer.send('window-control', action)  // 发送控制命令给主进程
    },
    toggleMaximize(){
      console.log(this.isMaximized);
      ipcRenderer.send("window-control", "maximize");
    },
    handleSearch(){
      const query = this.$refs.searchInput.value;
      console.log("search triggered with query", query);
    }
  }
}
</script>

<style scoped>

/* 主题切换开关样式 */
.theme-switch {
  -webkit-app-region: no-drag;
  width: 50px;
  height: 24px;
  border-radius: 12px;
  background-color: #ccc;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}
.theme-switch .toggle-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  left: 2px;
  transition: left 0.3s;
}
.theme-switch .toggle-circle-dark {
  left: 28px;
}

/* 深色模式全局样式 */
body.dark-mode {
  background-color: #333;
  color: #fff;
}

/* 标题栏样式 */
.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  background: linear-gradient(145deg, #ffffff, #d1d9e6);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  -webkit-app-region: drag;
}
body.dark-mode .title-bar {
  background: linear-gradient(145deg, #3c3f41, #2b2c2e);
}
.title-icon {
  -webkit-app-region: drag;
  height: 40px;
  width: 40px;
}

/* 语言选择器样式 */
.language-selector {
  width: 205px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 15px;
  -webkit-app-region: no-drag;
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
body.dark-mode .language-selector select {
  background-color: #444;
  color: #ddd;
  border: 1px solid #555;
}
.language-selector select:hover {
  border-color: #888;
}
.language-selector select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
.language-selector img {
  height: 30px;
  width: 30px;
  -webkit-app-region: drag;
  transition: color 0.5s ease-in-out;
}


/* 搜索框样式 */
.search-box{
  width: 200px;
  position: relative;
  padding: 0 10px;
  -webkit-app-region: no-drag;
}

.search-box input {
  width: 180px;
  padding: 5px 10px;
  padding-right: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

body.dark-mode .search-box input{
  background-color: #444;
  color: #ddd;
  border-color: #007bff;
}

.search-box input:focus{
  border-color: #007bff;
}

.search-icon{
  position:absolute;
  margin-left: 10px;
  left: 200px;
  top: 25%;
  color: #666;
  cursor: pointer;
}

body.dark-mode .search-icon{
  color: #ddd;
}



/* 窗口控制按钮样式 */
.window-controls {

  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 20px;
}
.window-controls button {
  background: none;
  border: none;
  color: blanchedalmond;
  font-size: 25px;
  cursor: pointer;
  -webkit-app-region: no-drag;
  transition: color 0.3s, transform 0.2s;
}
.window-controls button:hover {
  color: burlywood;
}
.window-controls button:active {
  transform: scale(1.05);
  border-radius: 5px;
}
#minimize-btn:hover { background: #3a8ec0; }
#maximize-btn:hover { background: #4caf50; }
#close-btn:hover { background: #e74c3c; }
body.dark-mode #minimize-btn:hover { background: #3a8ec0; }
body.dark-mode #maximize-btn:hover { background: #4caf50; }
body.dark-mode #close-btn:hover { background: #e74c3c; }
body.dark-mode .window-controls button:active {
  background-color: #555;
  filter: brightness(1.1);
}


</style>
