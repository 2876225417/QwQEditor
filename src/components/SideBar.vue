<template>

  <div class="sidebar-container">
    <button
        id="toggleButton"
        @click="toggleSidebar"
        :class="['toggle-button', { hidden: isSidebarCollapsed, 'dark-mode-button': isDarkMode }]"
    >
      <font-awesome-icon
          :icon="['fas', isSidebarCollapsed ? 'angle-right' : 'angle-left']"
          id="ToggleButtonIcon"
      />
    </button>


    <nav :class="['sidebar', { 'dark-mode-sidebar': isDarkMode, hidden: isSidebarCollapsed }]">
      <ul>
        <li>
          <router-link to="/home">
            <font-awesome-icon :icon="['fas', 'home']" class="OptionIcon"/>
            <transition name="fade">
              <span v-if="!isSidebarCollapsed">Home</span>
            </transition>
          </router-link>
        </li>


        <li>
          <router-link to="/about">
            <font-awesome-icon :icon="['fas', 'cogs']" class="OptionIcon"/>
            <span>About</span>
          </router-link>
        </li>

        <li>
          <router-link to="/Library">
            <font-awesome-icon :icon="['fas', 'book']" class="OptionIcon"/>
            <span>Library</span>
          </router-link>
        </li>

        <li>
          <router-link to="/test">
            <font-awesome-icon :icon="['fas', 'file-pdf']" class="OptionIcon"/>
            <span>test</span>
          </router-link>
        </li>


        <li>
          <router-link to="/pdfReader">
            <font-awesome-icon :icon="['fas', 'file-pdf']" class="OptionIcon"/>
            <span>pdfReader</span>
          </router-link>
        </li>
        <!--带有子菜单-->
        <li class="service-option-container">
          <div class="service-option" @click="toggleServiceMenu">
            <font-awesome-icon :icon="['fas', 'user']" class="OptionIcon" />
            <transition name="fade">
              <span v-if="!isSidebarCollapsed">Service</span>
            </transition>
            <font-awesome-icon
                :icon="['fas', !isSidebarCollapsed ? 'angle-down' : 'angle-right']"
            />
          </div>

        <ul :class="['submenu', { 'submenu-collapsed' : isSidebarCollapsed, show: serviceMenuOpen }]"
            :style="submenuStyle"
            @click="toggleServiceMenu_"
        >

          <li><router-link to="/service/web">Web Dev</router-link></li>
          <li><router-link to="/service/web">Web Dev</router-link></li>
          <li><router-link to="/service/web">Web Dev</router-link></li>
        </ul>
        </li>
        <!-- -->
      </ul>
    </nav>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState } from "vuex";

export default {
  name: "SideBar",
  components: { FontAwesomeIcon },

  computed: {
    ...mapState([
        "isDarkMode",
    ])
  },


  data(){
    return {
      isSidebarCollapsed: false,
      serviceMenuOpen: false,
      submenuStyle: {},
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


    toggleSidebar(){
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },

    toggleServiceMenu_(){
      console.log(this.isSidebarCollapsed);
      if(!this.isSidebarCollapsed){
        this.isSidebarCollapsed = true;
        this.serviceMenuOpen = false;
      }
      this.servicemenuOpen = !this.servicemenuOpen;
    },

    toggleServiceMenu(){
      if(this.isSidebarCollapsed){
        this.isSidebarCollapsed = false;
      }
      this.serviceMenuOpen = !this.serviceMenuOpen;
    },
    handleToggleClick(){

      const sidebar = document.querySelector(".sidebar");
     //  sidebar.classList.toggle("hidden");
      this.serviceMenuOpen = false;
      console.log("Toggle clicked");
    },
    expandMenu(){
      this.serviceMenuOpen = !this.serviceMenuOpen;
    }
  }


};
</script>

<style scoped>




/* 淡入淡出动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


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

/* 深色模式 sidebar 样式 */
.dark-mode-sidebar {
  background-color: #444;
  color: #ecf0f1;
  transition: background-color 0.3s ease,
              padding 0.3s ease-in,
              color 0.3s ease,
              width 0.3s ease-in;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;

}

.sidebar ul li {
  padding: 15px 15px 15px 3px;
  transition: background 0.3s, transform 0.3s ease-in-out;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar ul li:hover {
  background-color: rgba(52, 73, 94, 0.7);
}

.sidebar ul li a{
  padding-left: 10px;
  color: #ecf0f1;
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  transition: color 0.3s, transform 0.3s ease-in-out;
}

.sidebar.hidden{
  padding-top: 100px;
  width: 80px;
  overflow: hidden;
  transition: width 0.3s ease-in, padding 0.3s ease-in;
}

.sidebar.hidden ul li a span{
  display: none;
}

.service-option.hidden ul li a span{
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
  max-height: 250px; /* 根据内容高度调整 */
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

.toggle-button {
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

.toggle-button.hidden{
  left: 60px;
}

/* 深色模式下的按钮样式 */
.dark-mode-button {
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
}

.dark-mode-button:hover {
  background-color: #444 !important; /* 鼠标悬停时的背景色 */
  color: #ddd !important; /* 鼠标悬停时的文本颜色 */
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

/* 选中状态的样式 */
.router-link-active {
  background-color: rgba(26, 88, 156, 0.2);
  color: #1abc9c;
  border-radius: 6px;
  padding: 6px 6px 6px 6px;
  transition: color 0.3s ease-in-out;
}

.router-link-active .OptionIcon{
  transform: scale(1.1);
  transition: transform 0.5s, color 0.5s;
}

.OptionIcon{
  height: 25px;
  transform: translateX(10px);
  padding-right: 20px;
}


</style>
