<template>
  <div class="sidebar-container">
    <button id="toggleButton" aria-label="Toggle Sidebar">
      <font-awesome-icon :icon="['fas', 'angle-left']" id="ToggleButtonIcon"/>
    </button>

    <nav class="sidebar">
      <ul>
        <li>
          <router-link to="/home">
            <font-awesome-icon :icon="['fas', 'home']" class="OptionIcon"/>
            <span>Home</span>
          </router-link>
        </li>
        <li>
          <router-link to="/about">
            <font-awesome-icon :icon="['fas', 'cogs']" class="OptionIcon"/>
            <span>About</span>
          </router-link>
        </li>
        <li id="serviceLink">
          <router-link to="/service">
            <font-awesome-icon :icon="['fas', 'user']" class="OptionIcon"/>
            <span>Service</span>
          </router-link>
        </li>

        <ul v-show="serviceMenuOpen" class="submenu">
          <li><router-link to="/service/web">Web Dev</router-link></li>
          <li><router-link to="/service/web">Web Dev</router-link></li>
          <li><router-link to="/service/web">Web Dev</router-link></li>
        </ul>

        <li>
          <router-link to="/pdfReader">
            <font-awesome-icon :icon="['fas', 'file-pdf']" class="OptionIcon"/>
            <span>pdfReader</span>
          </router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "SideBar",
  components: {FontAwesomeIcon},

  data(){
    return {
      serviceMenuOpen: false,
    }
  },

  mounted(){
    const toggleButton = document.getElementById("toggleButton");
    const serviceLinkOp = document.getElementById("serviceLink");


    if(toggleButton){
      toggleButton.addEventListener("click", this.handleToggleClick);
    }

    if(serviceLinkOp){
      serviceLinkOp.addEventListener("click", this.expandMenu);
    }

  },

  // 在组件销毁前移除事件监听器
  beforeUnmount(){
    const toggleButton = document.getElementById("toggleButton");
    const serviceLinkOp = document.getElementById("serviceLink");

    if(toggleButton){
      toggleButton.removeEventListener("click", this.handleToggleClick);
    }
  },

  methods:{
    handleToggleClick(){
      this.serviceMenuOpen = !this.serviceMenuOpen;
      const sidebar = document.querySelector(".sidebar");
      sidebar.classList.toggle("hidden");
      // this.serviceMenuOpen = false;
      console.log("Toggle clicked");
    },
    expandMenu(){
      // this.serviceMenuOpen = !this.serviceMenuOpen;
    }
  }


};
</script>

<style scoped>
.sidebar-container{
  padding: 0;
}


.sidebar {
  padding-top: 100px;
  -webkit-app-region: no-drag;
  width: 200px;
  height: 100%;
  background-color: rgba(75, 130, 211, 0.85);
  transition: width 0.3s ease-in,
              padding 0.3s ease-in,
              background-color 0.3s ease;
  overflow: hidden;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  padding: 15px;
  transition: background 0.3s, transform 0.3s ease-in-out;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar ul li:hover {
  background-color: rgba(52, 73, 94, 0.7);
  transform: scale(1.05);
}

.sidebar ul li a{
  color: #ecf0f1;
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  transition: color 0.3s, transform 0.3s ease-in-out;
}

.sidebar.hidden{
  padding-top: 70px;
  width: 80px;
  overflow: hidden;
  transition: width 0.3s ease-in, padding 0.3s ease-in;
}

.sidebar.hidden ul li a span{
  display: none;
}

.sidebar.hidden ul li a{
  margin: 0 auto;
  font-size: 24px;
  transition: font-size 0.5s ;
}

/* 子菜单的样式 */
.submenu {
  z-index: 100;
  list-style: none;
  padding-left: 20px; /* 缩进效果 */
  margin-top: 5px;
  overflow: hidden; /* 确保折叠时隐藏内容 */
  max-height: 0; /* 初始状态折叠 */
  transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
  opacity: 0;
}

/* 当子菜单展开时 */
.submenu.show {
  max-height: 200px; /* 根据内容高度调整 */
  opacity: 1;
}

/* 子菜单项的样式 */
.submenu li {
  margin: 5px 0;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

/* 鼠标悬停时的效果 */
.submenu li:hover {
  background-color: rgba(255, 255, 255, 0.2);
}



#toggleButton {
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 2px #ecf0f1;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  -webkit-app-region: no-drag;
  position: fixed;
  top: 120px;
  left: 180px;
  z-index: 10;
  background: linear-gradient(145deg, #ffffff, #d1d9e6);
  border: none;
  cursor: pointer;
  outline: none;
  transition: left 0.3s ease-in, box-shadow 0.3s ease, background 0.3s ease;
}

#ToggleButtonIcon{
  font-size: 20px;
  color: #333;
  transition: color 0.3s, transform 0.3s ease;
}

#toggleButton:hover {
  background: linear-gradient(145deg, #e0e6ed, #ffffff);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3), 0 0 0 2px #ecf0f1;
}

#ToggleButtonIcon:hover {
  color: #1abc9c;
  transform: scale(1.1);
}





</style>
