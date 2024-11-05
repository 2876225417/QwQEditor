import { createApp } from 'vue';
// import './style.css'
import App from './App.vue';
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import vuetify from './plugins/vuetify'; // 引入 Vuetify



import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
    faHome,
    faUser,
    faCogs,
    faEnvelope,
    faFilePdf,
    faAngleLeft,
    faAngleRight,
    faAngleUp,
    faAngleDown,
    faWindowRestore,
    faWindowMaximize,
    faWindowMinimize,
    faWindowClose,
    faSearch,
    faBook,
    faFolder,
    faFolderClosed,
    faFile,
    faBookOpen,
    faPen,
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faHome,
    faUser,
    faCogs,
    faEnvelope,
    faFilePdf,
    faAngleLeft,
    faAngleRight,
    faAngleUp,
    faAngleDown,
    faWindowRestore,
    faWindowMaximize,
    faWindowMinimize,
    faWindowClose,
    faSearch,
    faBook,
    faFolder,
    faFolderClosed,
    faFile,
    faBookOpen,
    faPen,
);

const app = createApp(App);

// 使用插件
app.use(store);
app.use(router);
app.use(i18n);
app.use(vuetify); // 使用 Vuetify

// 注册 FontAwesomeIcon 组件
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount("#app");
