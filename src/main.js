import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import 'lib-flexible/flexible.js'
import fastclick from 'fastclick'



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

