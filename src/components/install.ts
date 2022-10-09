import _Vue, { PluginFunction, VueConstructor } from 'vue'

import ElLayout from './index.vue'

import { AppModule as LAppModule } from './store/modules/app'
import { PermissionModule as LPermissionModule } from './store/modules/permission'
import { SettingsModule as LSettingsModule } from './store/modules/settings'
import { TagsViewModule as LTagsViewModule } from './store/modules/tags-view'

interface InstallFunction extends PluginFunction<any> {
  installed?: boolean
}

const install: InstallFunction = (Vue: typeof _Vue) => {
  if (install.installed) return

  Vue.component('el-layout', ElLayout)

  install.installed = true
}

export default install

export { LAppModule, LPermissionModule, LSettingsModule, LTagsViewModule }
