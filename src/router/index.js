import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/search-cargo',
                    name: 'searchcargo',
                    component: () => import('@/views/uikit/search-cargo.vue')
                },
                {
                    path: '/uikit/search-truck',
                    name: 'searchtruck',
                    component: () => import('@/views/uikit/search-truck.vue')
                },
                {
                    path: '/uikit/create-cargo',
                    name: 'create-cargo',
                    component: () => import('@/views/uikit/create-cargo.vue')
                },
                {
                    path: '/uikit/create-truck',
                    name: 'create-truck',
                    component: () => import('@/views/uikit/create-truck.vue')
                },
                {
                    path: '/uikit/my-cargo',
                    name: 'mycargo',
                    component: () => import('@/views/uikit/my-cargo.vue')
                },
                {
                    path: '/uikit/my-truck',
                    name: 'mytruck',
                    component: () => import('@/views/uikit/my-truck.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/forgot-password',
            name: 'forgot',
            component: () => import('@/views/pages/auth/ForgotPassword.vue')
        },
        {
            path: '/auth/sign-up',
            name: 'signup',
            component: () => import('@/views/pages/auth/SignUp.vue')
        },

        {
            path: '/auth/profile',
            name: 'notfound',
            component: () => import('@/views/pages/auth/Profile.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
