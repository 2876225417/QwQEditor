import { createRouter, createWebHashHistory } from 'vue-router'

// 引入页面组件
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Service from '../pages/Service.vue'

// 定义路由规则
const routes = [
    { path: '/', component: Home },
    { path: '/home', component: Home },
    { path: '/about', component: About },
    { path: '/service', component: Service },
]

// 创建并导出路由实例
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
