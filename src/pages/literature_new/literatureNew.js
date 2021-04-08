//import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
//import VueValidator from 'vue-validator'
import App from './app.vue'
import VueRouter from "vue-router"
import Element from 'element-ui'
import VueCookie from 'vue-cookie'
import Lib from 'assets/Lib.js'
import VueLocalStorage from 'vue-localstorage'

import axios from 'axios'
import VueAxios from 'vue-axios'
require('es6-promise').polyfill();
Vue.use(VueAxios, axios)

Vue.use(Element)
Vue.use(VueCookie);
//Vue.use(VueValidator);
Vue.use(VueRouter);
Vue.use(VueLocalStorage)

import { EventBus } from 'assets/event-bus.js';

//import aa from 'mock/data';

//开启debug模式
Vue.config.debug = true;

// 定义组件
//import downloadCertificate from './component/downloadCertificate.vue'
// import form from './component/form.vue'

// 配置路由
const router = new VueRouter({
  //mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
    }
  ]
})

// 配置全局根路径
global.Path = axios.defaults.baseURL = CONFIG.czUrl;
axios.defaults.withCredentials = true;
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers.Authorization = VueCookie.get('user_token');// || 'iprp_member-c51bc2c82fe14ffe8305ee17fa8d30011de3eb14d4634483a3c6702298c36372';
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


// 启动应用
const app = new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')
