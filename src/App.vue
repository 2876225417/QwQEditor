<template>
  <div class="container-layout">
    <!-- 根据当前路由条件渲染 TitleBar -->
    <TitleBar v-if="!isNotePage" />

    <div class="middle-container">
      <!-- 根据当前路由条件渲染 SideBar -->
      <SideBar v-if="!isNotePage" />

      <keep-alive>
        <div class="content-container">
          <router-view></router-view>
        </div>
      </keep-alive>
    </div>

    <StatusBar v-if="!isNotePage"/>
  </div>
</template>

<script>
import TitleBar from "./components/TitleBar.vue";
import SideBar from "./components/SideBar.vue";
import StatusBar from "./components/StatusBar.vue";

export default {
  name: "App",
  components: {
    TitleBar,
    SideBar,
    StatusBar,
  },
  computed: {
    isNotePage() {
      return this.$route.path === '/Library/NoteBook'; // 根据路由判断是否是笔记页面
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  overflow: hidden;
}

.container-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

/* 固定 TitleBar 高度 */
.title-bar {
  height: 50px; /* 你可以调整这个高度 */
  background-color: #444;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

/* 中间部分：侧边栏 + 内容区域 */
.middle-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

/* 侧边栏中的导航 */
.sidebar ul {
  list-style: none;
  width: 100%;
}

.sidebar li {
  margin: 10px 0;
}

/* 内容区域 */
.content-container {
  width: 100%;
  height: calc(100vh - 80px);
  overflow-y: auto;
  background-color: #f0f0f0;
}

body.dark-mode .content-container {
  background-color: #1e1e1e; /* 深色背景 */
  color: #e0e0e0; /* 浅色文本 */
  transition: background-color 0.3s, color 0.3s; /* 平滑的过渡效果 */
}

/* 底部状态栏 */
.status-bar {
  height: 30px;
  background-color: #333;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}
</style>
