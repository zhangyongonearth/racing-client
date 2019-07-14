import Vue from 'vue'
import App from './zhuchi.vue'
import '@/icons' // icon
import Element from 'element-ui'
import Vant from 'vant'
import 'element-ui/lib/theme-chalk/index.css'
import 'vant/lib/index.css'
Vue.use(Element)
Vue.use(Vant)

// Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
