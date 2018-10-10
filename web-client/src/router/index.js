import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Register from '../components/register/register.vue'
import FindPwd from '../components/findpwd/findpwd.vue'
import Settings from '../components/settings/settings.vue'
import AdminMain from '../components/main/admin-main.vue'
import inviteReg from '../components/register/invitereg.vue'
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
        }, {
            path: '/find',
            name: 'FindPwd',
            component: FindPwd
        },
        {
            path: '/settings',
            name: 'Settings',
            component: Settings,
        },
        {
            path: '/admin-main',
            name: 'admin-main',
            component: AdminMain,
        },
        {
          path:'/invite',
          name:'invite',
          component:inviteReg
        }

    ]
})
