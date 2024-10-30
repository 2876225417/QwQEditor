<template>
  <div class="pdfReader_container">
    <iframe
        class="pdf_viewer"
        id="pdfViewer"
        :src="pdfViewerSrc"
        frameborder="0"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "PdfReader",
  data() {
    return {
      // 通过 public 目录引用静态资源
      pdfViewerSrc: "/pdfjs/web/viewer.html",
    };
  },
};
</script>

<style scoped>
.pdfReader_container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.pdf_viewer {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
