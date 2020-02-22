import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import './assets/style.scss'
// import websocket from './ws.js'

// Vue.prototype.websocket = websocket

Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  render: h => h(App),
}).$mount('#app')
