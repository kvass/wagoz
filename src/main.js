import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import './assets/style.scss'
import VueSocketIO from 'vue-socket.io';


Vue.use(new VueSocketIO({debug: true, connection: '//localhost:3000'}))

Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.withCredentials = true;


new Vue({
  render: h => h(App),
}).$mount('#app')
