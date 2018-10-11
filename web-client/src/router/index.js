import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Register from '../components/register/register.vue'
import AdminMain from '../components/main/admin-main.vue'
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Login',
            component: Login
        }, {
            path: '/login',
            name: 'Login',
            component: Login
        }, {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/admin-main',
            name: 'admin-main',
            component: AdminMain,
        },

    ]
})
