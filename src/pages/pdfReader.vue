<template>
  <div class="pdfReader_container">
    <input type="file" accept="application/pdf" @change="onFileChange" />
    <iframe
        class="pdf_viewer"
        id="pdfViewer"
        :src="pdfViewerSrc"
        frameborder="0"
    ></iframe>
  </div>
</template>

<script>
import { savePdfFile, getPdfFile } from '../indexedDB'; // 确保正确路径

export default {
  name: "PdfReader",
  data() {
    return {
      pdfViewerSrc: "/pdfjs/web/viewer.html",
    };
  },
  methods: {
    async onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const filePath = URL.createObjectURL(file);
        this.pdfViewerSrc = `/pdfjs/web/viewer.html?file=${encodeURIComponent(filePath)}`;

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
        this.pdfViewerSrc = `/pdfjs/web/viewer.html?file=${encodeURIComponent(filePath)}`;
      }
    },
  },
  mounted() {
    // 你可以替换为合适的文件名
    this.loadFile('123.pdf'); // 加载特定 PDF 文件

  },
};
</script>

<style scoped>
.pdfReader_container {
  //display: flex;
  //width: 100%;
  //height: 100vh;
  //overflow: hidden;
}

.pdf_viewer {
  //width: 100%;
  //height: 100%;
  //border: none;
}
</style>
