import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VModal from 'vue-js-modal'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import VueTheMask from 'vue-the-mask'
import flatpickr from "flatpickr"
import Vuelidate from 'vuelidate'
import vueTippy from 'vue-tippy'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Vue.use(VModal, {
  dynamicDefaults: {
    draggable: true,
    resizable: true
  }
})
Vue.use(VueTheMask)
Vue.use(flatpickr)
Vue.use(Vuelidate)
Vue.use(vueTippy)