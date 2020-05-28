import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import alerta from 'vue-sweetalert2'
import store from './store'

Vue.config.productionTip = false
Vue.use(alerta);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
