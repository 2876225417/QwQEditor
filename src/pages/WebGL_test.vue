<template>
  <div ref="webglCanvas" class="webgl-canvas"></div>
</template>

<script>
import * as THREE from "three"; // 如果使用Three.js

export default {
  name: "WebGLView",
  mounted() {
    this.initWebGL();
  },
  methods: {
    initWebGL() {
      // 获取容器
      const container = this.$refs.webglCanvas;

      // 创建场景和相机
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight,
          0.1,
          1000
      );
      camera.position.z = 5;

      // 创建渲染器
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      // 添加一个简单的立方体
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // 渲染循环
      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    },
  },
};
</script>

<style scoped>
.webgl-canvas {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
