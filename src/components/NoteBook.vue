<template>
  <div class="markdown-editor">
    <MdEditor v-model="text" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('# Hello Editor'); // 初始化 Markdown 内容
</script>

<style scoped>
.markdown-editor {
  padding: 20px;
  border: 1px solid #ccc; /* 可以自定义样式 */
}
</style>
