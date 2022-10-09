import ElLayout from './index.vue'

import { AppModule as LAppModule } from './store/modules/app'
import { PermissionModule as LPermissionModule } from './store/modules/permission'
import { SettingsModule as LSettingsModule } from './store/modules/settings'
import { TagsViewModule as LTagsViewModule } from './store/modules/tags-view'

export default ElLayout

export { LAppModule, LPermissionModule, LSettingsModule, LTagsViewModule }
