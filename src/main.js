import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import 'lib-flexible/flexible.js'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import message from '@/extend/message'

Vue.prototype.$message = message;

Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
  el: '#app',
  render: h => h(App)
})
