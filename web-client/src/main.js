// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import md5 from 'md5'
import ElementUI from 'element-ui'
import Validator from 'vue-validator'
import 'element-ui/lib/theme-default/index.css'
import './common/stylus/iconfont.styl';
import './common/stylus/common.styl'
import { ZTree } from 'vue2-lazy-tree'
Vue.use(ZTree)


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAxios,axios)
Vue.use(md5)
Vue.use(Validator)
new Vue({
  mode:'history',
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
