import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import 'element-ui/lib/theme-chalk/index.css'

import App from '@/App.vue'
import router from '@/router'

import store from '@/store'
import '@/icons/components'

import ElLayout from '@/layout/index.js'
import '@/layout/styles/index.scss'

Vue.use(ElementUI)
Vue.use(ElLayout)

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.config.productionTip = false

new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app')
