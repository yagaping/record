import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import api from './api'

Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.prototype.bus = new Vue()

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
