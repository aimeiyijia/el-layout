import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import 'element-ui/lib/theme-chalk/index.css'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/icons/components'

// import { ElLayout, ElLayoutStore } from '../dist/el-layout.common.js'
// import '../dist/el-layout.css'
import { ElLayout, ElLayoutStore } from './layout/index.js'
import '@/layout/styles/index.scss'

Vue.use(ElementUI)

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.use(ElLayout)

Vue.config.productionTip = false

new Vue({
  router,
  store: Object.assign(store, ElLayoutStore),
  render: h => h(App)
}).$mount('#app')
