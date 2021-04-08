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
Vue.use(VueLocalStorage)

import { EventBus } from 'assets/event-bus.js';

//import aa from 'mock/data';
//开启debug模式
Vue.config.debug = false;

import main from './main'
import oldApp from './app'
import appNew from './appNew'
const routes = [
	{ path: '/', component: main },
  { path: '/app', component: oldApp },
  { path: '/appNew', component: appNew}
]
Vue.use(VueRouter)

const router = new VueRouter({
  routes:routes
})

// 配置全局根路径
global.Path = axios.defaults.baseURL = CONFIG.czUrl;
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers.Authorization = VueCookie.get('user_token');// || 'iprp_member-99';
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

//
axios.interceptors.response.use(function (response) {
  // Do something with response data
  var data = response && response.data;
  if(data && data.code == '4010008') {
    EventBus.$emit('needLogin');
  };
  return response;
}, function (error) {
  var data = error && error.response && error.response.data;
  if(data && (data.status == 401 || data.code == '4010008')) {
    EventBus.$emit('needLogin');
  };
  // Do something with response error
  return Promise.reject(error);
});
// 启动应用
const app = new Vue({
  router: router
}).$mount('#app')
