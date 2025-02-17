<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Грузы',
        items: [
            { label: 'Поиск грузов', icon: 'pi pi-fw pi-box', to: '/uikit/search-cargo' },
            { label: 'Добавить груз', icon: 'pi pi-fw pi-box', to: '/uikit/create-cargo' },
            { label: 'Мои грузы', icon: 'pi pi-fw pi-box', to: '/uikit/my-cargo' }
        ]
    },

    {
        label: 'Транспорт',
        items: [
            { label: 'Поиск транспорта', icon: 'pi pi-fw pi-truck', to: '/uikit/search-truck' },
            { label: 'Добавить транспорт', icon: 'pi pi-fw pi-truck', to: '/uikit/create-truck' },
            { label: 'Мой транспорт', icon: 'pi pi-fw pi-truck', to: '/uikit/my-truck' }
        ]
    },
    {
        label: 'Авторизация',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Вход',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Забыли пароль',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/forgot-password'
                    },
                    {
                        label: 'Регистрация',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/sign-up'
                    },

                    {
                        label: 'Ошибка',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    },

                    {
                        label: 'Профиль',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/profile'
                    },
                    {
                        label: 'Доступ запрещен',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access'
                    }
                ]
            },
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud'
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/pages/notfound'
            },
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/empty'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
