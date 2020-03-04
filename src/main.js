import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import './assets/style.scss'
import VueSocketIO from 'vue-socket.io';


Vue.use(new VueSocketIO({debug: true, connection: '//127.0.0.1:8098'}))
// Vue.use(new VueSocketIO({debug: true, connection: '//api.wagoz.cn'}))

Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.withCredentials = true;


new Vue({
  render: h => h(App),
}).$mount('#app')
