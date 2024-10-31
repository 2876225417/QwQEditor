

import { createRouter, createWebHashHistory } from "vue-router"

import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Service from "../pages/Service.vue";
import PdfReader from "../pages/pdfReader.vue";

const routes = [
    { path: '/', component: Home },
    { path: "/home", component: Home },
    { path: "/about", component: About },
    { path: "/service", component: Service },
    { path: "/pdfReader", component: PdfReader},
];

const index = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default index;