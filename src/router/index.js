import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import PortfolioPage from '../pages/PortfolioPage.vue';
import UsersPage from '../pages/UsersPage.vue';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/portfolio',
        name: 'Portfolio',
        component: PortfolioPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/users',
        name: 'Users',
        component: UsersPage,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !localStorage.getItem('authToken')) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
