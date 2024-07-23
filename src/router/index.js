// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import WordManagement from '../views/WordManagement.vue'
import CategoryManagement from '../views/CategoryManagement.vue'
import GroupManagement from '../views/GroupManagement.vue'
import Search from '../views/Search.vue'
import SpeedMath from "../views/SpeedMath.vue";

const routes = [
    { path: '/words', component: WordManagement },
    { path: '/categories', component: CategoryManagement },
    { path: '/groups', component: GroupManagement },
    { path: '/speedMath', component: SpeedMath },
    { path: '/', component: Search },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
