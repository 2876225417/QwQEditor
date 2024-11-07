<template>
  <div>
    <canvas ref="canvas" :width="800" :height="600"></canvas>
    <button @click="startRotation">Start Rotation</button>
  </div>
</template>

<script>
const path = require("path");
const drawModule = require(path.resolve(__dirname, "../../../../../../native/build/Release/Modules.node"));

export default {
  name: "OpenGLCanvas",
  data() {
    return {
      animationFrameId: null
    };
  },
  methods: {
    startRotation() {
      // 开始旋转的动画循环
      const render = () => {
        const frameData = drawModule.draw();
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext("2d");

        const width = 800;
        const height = 600;
        const imageData = ctx.createImageData(width, height);
        const dataArray = new Uint8ClampedArray(frameData);

        // 反转行数据，因为 OpenGL 坐标系与 canvas 不同
        for (let row = 0; row < height; row++) {
          const sourceRow = (height - 1 - row) * width * 4;
          const targetRow = row * width * 4;
          imageData.data.set(dataArray.subarray(sourceRow, sourceRow + width * 4), targetRow);
        }

        ctx.putImageData(imageData, 0, 0);

        // 请求下一帧
        this.animationFrameId = requestAnimationFrame(render);
      };

      // 启动渲染循环
      render();
    },
    stopRotation() {
      // 停止动画
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
  },
  beforeDestroy() {
    // 清理动画帧
    this.stopRotation();
  }
};
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>
