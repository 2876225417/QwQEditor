// src/store/index.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        isDarkMode: false, // 深色模式状态
        language: "en",    // 默认语言
        isLibraryMenuVisible: false,
        isContextMenuVisible: false, // 新增状态

    },
    mutations: {
        toggleTheme(state) {
            state.isDarkMode = !state.isDarkMode;
        },
        setTheme(state, isDarkMode) {
            state.isDarkMode = isDarkMode;
        },
        setLanguage(state, language){
            state.language = language;
        },
        setLibraryMenuVisible(state, isVisible) {
            console.log("store lib: ", isVisible);
            state.isLibraryMenuVisible = isVisible;
        },
        setContextMenuVisible(state, isVisible) { // 新增 mutation
            state.isContextMenuVisible = isVisible;
        },
    },
    actions: {
        toggleTheme({ commit }) {
            commit('toggleTheme');
        },
        setTheme({ commit }, isDarkMode) {
            commit('setTheme', isDarkMode);
        },
        setLanguage({ commit }, language ){
            commit("setLanguage", language);
        }
    },
    getters: {
        isDarkMode: (state) => state.isDarkMode,
        language: (state) => state.language,
    }
});

export default store;
