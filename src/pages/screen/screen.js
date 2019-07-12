import Vue from 'vue'
import App from './screen.vue'
import Element from 'element-ui'
import '@/icons'
import 'element-ui/lib/theme-chalk/index.css'
import ScratchCard from 'vue-scratch-card0'
Vue.use(ScratchCard)
Vue.use(Element)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
