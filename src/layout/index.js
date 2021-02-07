import ElLayout from './index.vue'
import ElLayoutStore from '@/layout/store'

function install(Vue, options = {}) {
  if (install.installed) return
  install.installed = true

  Vue.component('el-layout', ElLayout)
}
ElLayout.install = install

// auto plugin install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.vue
}
if (GlobalVue) {
  GlobalVue.use(ElLayout)
}

// export default
export { ElLayout, ElLayoutStore }
