import Vue from 'vue'
import Pc from './views/Pc.vue'
import Mobile from './views/Mobile.vue'

Vue.config.productionTip = false

var width = document.documentElement.clientWidth

new Vue({
  render: h => h(width > 500 ? Pc : Mobile)
}).$mount('#app')
