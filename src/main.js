import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from "./router/router"

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faHome, faUser, faCogs, faEnvelope, faFilePdf, faAngleLeft, faAngleRight, faAngleUp, faAngleDown} from "@fortawesome/free-solid-svg-icons";

library.add(faHome, faUser, faCogs, faEnvelope, faFilePdf, faAngleLeft, faAngleRight, faAngleUp, faAngleDown);

const app = createApp(App);
app.use(router);
app.mount("#app");