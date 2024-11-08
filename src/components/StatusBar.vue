


<template>
<div>
  <v-divider
      style="position: fixed; bottom: 30px; width: 100%; background-color: #ccc; z-index: 100"
      :thickness="0"
      :opacity="0.5"
  ></v-divider>

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

<style>



</style>
