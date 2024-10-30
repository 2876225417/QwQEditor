


<template>
  <div class="StatusBarContainer">
    <!--左状态栏-->
    <div class="StatusBarLeft">
      <span id="StatusBarLeft-text">{{ StatusBarLeftText }}</span>
    </div>
    <!--右状态栏-->
    <div class="StatusBarRight">
      <span id="StatusBarRight-text">{{ StatusBarRightText }}</span>
    </div>
  </div>
</template>

<script>
import "../assets/styles/statusBar.css"; // 导入独立的 CSS 文件


export default{
  name: "StatusBar",
  data() {
    return {
      StatusBarLeftText: "Ready",
      StatusBarRightText: "No File",
    };
  },
  methods: {
    UpdateStatusLeftText(text) {
      this.StatusBarLeftText = text;
    },
    UpdateStatusRightText(text){
      this.StatusBarRightText = text;
    },
  },
};

</script>
