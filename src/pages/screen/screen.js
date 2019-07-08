import Vue from 'vue'
import App from './screen.vue'
import Element from 'element-ui'
import '@/icons'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
