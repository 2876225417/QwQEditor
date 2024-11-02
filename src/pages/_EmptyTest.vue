<template>
  <div>
    <h1>Test Multi-threaded Task</h1>
    <button @click="startLongTask">Start Long Task</button>
    <p>{{ message }}</p>
  </div>
</template>

<script>
// 直接使用 Node.js 的 require 导入你的 C++ 插件
const path = require('path');
const myAddon = require(path.resolve(__dirname, '../../../../../../src-electron/cppAddons/myaddon.node'));


export default {
  data() {
    return {
      message: "Click the button to start a long task."
    };
  },
  methods: {
    startLongTask() {
      try {
        // 调用 myAddon 的 startThread 方法，并传递一个回调函数
        myAddon.startThread((result) => {
          this.message = result;
        });
        this.message = "Task started, please wait...";
      } catch (error) {
        console.error("Error starting long task:", error);
      }
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

p {
  font-size: 18px;
  margin: 5px 0;
}
</style>


