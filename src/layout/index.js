import ElLayout from './index.vue'

import { AppModule } from './store/modules/app.ts'
import { PermissionModule } from './store/modules/permission.ts'
import { SettingsModule } from './store/modules/settings.ts'
import { TagsViewModule } from './store/modules/tags-view.ts'

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

export default ElLayout
export { AppModule, PermissionModule, SettingsModule, TagsViewModule }
