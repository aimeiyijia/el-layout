import Vue from 'vue'
import router from '@/router'
import 'normalize.css'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import ElLayout from './components/install'

import App from './app.vue'

Vue.use(ElementUI)
Vue.use(ElLayout)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
