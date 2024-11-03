<template>
  <div class="pdfReader_container">
    <iframe
        class="pdf_viewer"
        id="pdfViewer"
        :src="pdfViewerSrc"
        frameborder="0"
    ></iframe>

    <!-- 替换为书本图标 -->
    <font-awesome-icon
        :icon="['fas', 'book']"
        class="upload-icon"
        @click="triggerFileInput"
    />

    <!-- 隐藏的文件输入 -->
    <input
        type="file"
        accept="application/pdf"
        ref="fileInput"
        @change="onFileChange"
        style="display: none;"
    />
  </div>
</template>

<script>
import { savePdfFile, getPdfFile } from '../indexedDB';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; // 确保正确路径

export default {
  name: "PdfReader",
  components: { FontAwesomeIcon },
  data() {
    return {
      pdfViewerSrc: "/pdfjs/web/viewer.html?locale=en", // 默认语言为英语
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click(); // 触发隐藏的文件输入
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const filePath = URL.createObjectURL(file);
        this.pdfViewerSrc = `/pdfjs/web/viewer.html?file=${encodeURIComponent(filePath)}&locale=en`;

        // 保存文件到 IndexedDB
        await this.saveFile(file);
      }
    },
    async saveFile(file) {
      await savePdfFile(file);
    },
    async loadFile(fileName) {
      const file = await getPdfFile(fileName); // 假设你要获取的文件名是已知的
      console.log("filename:", fileName);
      if (file) {
        const filePath = URL.createObjectURL(file);
        const locale = 'en'; // 设置所需的语言
        this.pdfViewerSrc = `/pdfjs/web/viewer.html?file=${encodeURIComponent(filePath)}&locale=en`;



      }
    },
    getPdfViewerStatus() {
      const iframe = document.getElementById('pdfViewer');
      iframe.contentWindow.postMessage('getStatus', '*');
    },
    handleMessage(event) {
      if (event.origin === '你的 iframe 域名') { // 确保来源安全
        const { page, scale, totalPages } = event.data;
        console.log('Current page:', page);
        console.log('Current scale:', scale);
        console.log('Total pages:', totalPages);
      }
    },
  },
  mounted() {
    window.addEventListener('message', this.handleMessage);
    // 你可以替换为合适的文件名
    this.loadFile('123.pdf'); // 加载特定 PDF 文件

  },
};
</script>

<style scoped>


.upload-icon {
  position: fixed; /* 固定在页面右下角 */
  bottom: 40px; /* 距离底部20px */
  right: 40px; /* 距离右侧20px */
  font-size: 40px; /* 图标大小 */
  color: #007bff; /* 图标颜色 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  transition: transform 0.2s; /* 平滑过渡效果 */
}

.upload-icon:hover {
  color: #0056b3; /* 悬停时变色 */
  transform: scale(1.1); /* 悬停时放大 */
}

.upload-icon:active {
  transform: rotate(360deg); /* 点击时旋转 */
}


.pdfReader_container {
  display: flex;
  width: 100%;
  height: calc(100vh - 80px);
  overflow: hidden;
  padding: 0 !important;
}

.pdf_viewer {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
