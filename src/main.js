import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from "./router"
import store from "./store";
import i18n from "./i18n";

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
    faBook,);

const app = createApp(App);
app.use(router);
app.use(store);
app.use(i18n);
app.mount("#app");
