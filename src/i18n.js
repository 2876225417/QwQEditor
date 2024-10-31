// src/i18n.js
import { createI18n } from 'vue-i18n';

// 定义语言内容
const messages = {
    en: {
        welcome: 'Welcome to the Home page!',
        searchPlaceholder: 'Search...',
        language: 'Language'
    },
    zh: {
        welcome: '欢迎来到主页！',
        searchPlaceholder: '搜索...',
        language: '语言'
    }
};

// 创建 `vue-i18n` 实例
const i18n = createI18n({
    locale: 'en', // 默认语言
    messages
});

export default i18n;
