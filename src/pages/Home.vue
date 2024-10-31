<template>
  <div>
    <h1>{{ $t('welcome') }}</h1>
    <!-- 使用 isDarkMode 动态设置类 -->
    <div :class="{ 'dark-mode': isDarkMode }" class="content">
      <p>Current Dark Mode: {{ isDarkMode }}</p>
      <p>{{ $t('searchPlaceholder') }}</p>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  computed: {
    ...mapState([
        "isDarkMode",
        "language",
    ])
  },
  watch: {
    language(newLang){
      this.$i18n.locale = newLang;
    }
  }
};
</script>

<style scoped>
/* 默认的浅色模式样式 */
.content {
  background-color: #f9f9f9;
  color: #333;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;
}

/* 深色模式样式 */
.dark-mode {
  background-color: #333;
  color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
}
</style>
