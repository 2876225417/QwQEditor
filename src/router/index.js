

import { createRouter, createWebHashHistory } from "vue-router"

import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Service from "../pages/Service.vue";
import PdfReader from "../pages/pdfReader.vue";
import Library from "../pages/Library.vue"
import _EmptyTest from "../pages/_EmptyTest.vue";
import NoteBook from "../components/NoteBook.vue";
import FileTree from "../pages/FileTree.vue";
import OpenGL from "../pages/OpenGL.vue";


const routes = [
    { path: '/', component: Home },
    { path: "/home", component: Home },
    { path: "/about", component: About },
    { path: "/service", component: Service },
    { path: "/pdfReader", component: PdfReader },
    { path: "/Library", component: Library },
    { path: "/test", component: _EmptyTest },
    { path: "/Library/notebook", component: NoteBook },
    { path: "/FileTree", component: FileTree },
    { path: "/OpenGL", component: OpenGL },

];

const index = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default index;