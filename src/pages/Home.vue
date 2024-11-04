<template>
  <div class="Home-Container">
    <h1>{{ $t('welcome') }}</h1>
    <div :class="{ 'dark-mode': isDarkMode }" class="content">
      <p>Current Dark Mode: {{ isDarkMode }}</p>
      <p>{{ $t('searchPlaceholder') }}</p>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      selectedRadio: null, // 默认选中的值
    };
  },
  computed: {
    ...mapState(["isDarkMode", "language"]),
  },
  watch: {
    language(newLang) {
      this.$i18n.locale = newLang;
    },
  },
};
</script>

<style scoped>
.Home-Container {
  padding: 20px;
}

.content {
  background-color: #f9f9f9;
  color: #333;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;
}

.dark-mode {
  background-color: #333;
  color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
}
</style>
