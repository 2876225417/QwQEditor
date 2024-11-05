<template>
  <div>
    <h1>Test Multi-threaded Task</h1>
    <button @click="startLongTask">Start Long Task</button>
    <p>{{ message }}</p>
  </div>
</template>

<script>
const isDev = process.env.NODE_ENV === "development";

const path = require('path');

let myAddon;
if(isDev) {
  console.log(isDev);
  myAddon = require(path.resolve(__dirname, '../../../../../../src-electron/cppAddons/myaddon.node'));
}else{
  console.log(isDev);
  myAddon = require(path.join(process.resourcesPath, "build/Release/myaddon.node"));
}
const axios = require('axios');  // 引入 Axios

export default {
  data() {
    return {
      message: "Click the button to start a long task."
    };
  },
  methods: {
    startLongTask() {
      this.message = "Fetching IP address, please wait..."; // 更新提示信息

      // 替换为你的云服务器的地址
      const apiUrl = 'https://qintong.space/qwq/clientIP';

      // 使用 Axios 获取 IP 地址
      axios.get(apiUrl)
          .then(response => {
            this.message = `Your IP address is: ${response.data.ip}`; // 显示 IP 地址
          })
          .catch(error => {
            console.error("Error fetching IP:", error);
            this.message = "Failed to fetch IP address.";
          });

      // 如果需要，可以在这里继续调用 C++ 插件的 long task
      try {
        myAddon.startThread((result) => {
          this.message += `\nLong task result: ${result}`; // 更新结果信息
        });
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


