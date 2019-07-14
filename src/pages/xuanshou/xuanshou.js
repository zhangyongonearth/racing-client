import Vue from 'vue'
import App from './xuanshou.vue'
import '@/icons' // icon

import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

// Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
