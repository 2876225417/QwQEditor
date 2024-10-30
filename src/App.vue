<template>
  <div class="container">
    <TitleBar />
    <div class="sidebar-container">
      <button id="toggleButton" aria-label="Toggle Sidebar">
        <i class="fas fa-angle-left"></i>
      </button>

      <nav class="sidebar">
        <ul>
          <li><router-link to="/home">Home</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/service">Service</router-link></li>
        </ul>
      </nav>
    </div>

    <div class="content-container">
      <router-view></router-view> <!-- 动态加载的页面内容 -->
    </div>
  </div>
</template>

<script>
import TitleBar from './components/TitleBar.vue'


export default {
  name: 'App',
  components:{
    TitleBar,
  }

}
</script>

<style>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
