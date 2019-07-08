import Vue from 'vue'
import App from './xuanshou.vue'
import Element from 'element-ui'
import '@/icons' // icon
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element)

// import Icon from 'vue2-svg-icon/Icon.vue'
// Vue.component('icon', Icon)

// Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
