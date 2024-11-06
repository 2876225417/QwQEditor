<template>
  <v-container  class="title-bar-wrapper">
    <v-row align="center" justify="space-between">


      <!-- 使用 v-spacer 将搜索框居中 -->
      <v-spacer></v-spacer>

      <!-- 搜索框 -->
      <v-col cols="auto" class="search-box-wrapper">
        <v-text-field
            v-model="searchQuery"
            placeholder="ppqwqqq.space"
            @keyup.enter="handleSearch"
            prepend-inner-icon="mdi-magnify"
            @click:prepend-inner="handleSearch"
            class="search-box-wrapper"
            label="Search..."
            density="comfortable"
            dense
            hide-details
        >
          <template v-slot:loader>
            <v-progress-linear
                v-if="isLoading"
                :indeterminate="true"
                color="blue"
                height="7"
            ></v-progress-linear>
          </template>
        </v-text-field>
      </v-col>

      <!-- 使用 v-spacer 确保组件居中 -->
      <v-spacer></v-spacer>

      <!-- 主题切换开关 -->
      <v-col cols="auto">
        <v-switch
            v-model="isDarkMode"
            @change="onToggleTheme"
            class="theme-switch-wrapper"
            color="indigo"
            hide-details
        >
          <template v-slot:thumb>
            <span v-if="isDarkMode" class="icon-moon">🌙</span>
            <span v-else class="icon-sun">☀️</span>
          </template>
        </v-switch>
      </v-col>

      <!-- 语言选择菜单 -->
      <v-col cols="auto">
        <v-menu top right>
          <template v-slot:activator="{ props }">
            <v-btn  class="language-menu-wrapper" icon="mdi-earth" variant="text" v-bind="props"></v-btn>
          </template>
          <v-list
            :theme="theme"
          >
            <v-list-item @click="changeLanguage('en')">
              <v-list-item-title>{{ $t('language') }}: English</v-list-item-title>
            </v-list-item>
            <v-list-item @click="changeLanguage('zh')">
              <v-list-item-title>{{ $t('language') }}: 中文</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>

      <!-- 窗口控制按钮 -->
      <v-col cols="auto">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
                class="window-control-wrapper"
                icon="mdi-dots-vertical"
                variant="text"
                v-bind="props"
            ></v-btn>
          </template>
          <v-list :theme="theme">
            <!-- 最小化按钮 -->
            <v-list-item @click="windowControl('minimize')">
              <v-icon class="window-control-icon">mdi-window-minimize</v-icon>
            </v-list-item>

            <!-- 最大化/还原按钮 -->
            <v-list-item @click="toggleMaximize">
              <v-icon class="window-control-icon">
                {{ isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize' }}
              </v-icon>
            </v-list-item>

            <!-- 关闭按钮 -->
            <v-list-item @click="windowControl('close')">
              <v-icon class="window-control-icon">mdi-window-close</v-icon>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
  <v-divider></v-divider>
</template>



<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState, mapActions, mapGetters } from 'vuex';
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
    theme(){
      return this.isDarkMode ? "dark" : "light";
    },

    filteredItems() {
      // 过滤建议项
      return this.items.filter(item => item.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
  },


  data(){
    return {
      searchQuery: '',
      items: [ /* 你的建议项，例如： */ 'Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape' ],
      isMaximized: false,
      isLoading: false,
      language: 'en', // Default language
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
      // 开始搜索时设置 isLoading 为 true
      this.isLoading = true;

      // 模拟一个异步操作，例如发起搜索请求
      setTimeout(() => {
        // 假设搜索操作完成后，设置 isLoading 为 false
        this.isLoading = false;
        // 这里可以处理搜索结果
        console.log('Search completed for:', this.searchQuery);
      }, 4000); // 模拟 2 秒的异步操作
    },
    changeLanguage(lang) {
      this.language = lang;
      this.onLanguageChange();
    },

  }
}
</script>

<style scoped>


.title-bar-wrapper{
  padding: 0px;
  -webkit-app-region: drag;
  width: calc(100vw - 55px);
}
.search-box-wrapper{
  -webkit-app-region: no-drag;
  width: 350px;
}

.theme-switch-wrapper{
  -webkit-app-region: no-drag;
  transform: scale(1.35);
}

.language-menu-wrapper{
  -webkit-app-region: no-drag;
}

.window-control-wrapper{
  -webkit-app-region: no-drag;
}
/* 使用具体的选择器来选择 v-switch 的轨道 */





.window-control-icon{
  font-size: 20px;
}
</style>

