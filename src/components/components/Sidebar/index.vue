<template>
  <div :class="{'has-logo': showLogo}">
    <sidebar-logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="menuBgColor"
        :text-color="menuTextColor"
        :active-text-color="menuActiveTextColor"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Component, Vue } from 'vue-property-decorator'
import { AppModule, IAppState } from '@/components/store/modules/app'
import {
  TagsViewModule,
  ITagsViewState
} from '@/components/store/modules/tags-view'
import {
  PermissionModule,
  IPermissionState
} from '@/components/store/modules/permission'
import {
  SettingsModule,
  ISettingsState
} from '@/components/store/modules/settings'
import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'
import { RouteConfig } from 'vue-router'

@Component({
  name: 'SideBar',
  components: {
    SidebarItem,
    SidebarLogo
  }
})
export default class extends Vue {
  private AppModule: IAppState = AppModule
  private PermissionModule: IPermissionState = PermissionModule
  private SettingsModule: ISettingsState = SettingsModule
  private TagsViewModule: ITagsViewState = TagsViewModule

  get sidebar() {
    return this.AppModule.sidebar
  }

  get routes() {
    console.log(this.PermissionModule.routes, '路由')
    return this.PermissionModule.routes
  }

  get showLogo() {
    return this.SettingsModule.showSidebarLogo
  }

  get menuBgColor() {
    return this.SettingsModule.menuBgColor
  }

  get menuTextColor() {
    return this.SettingsModule.menuTextColor
  }

  get menuActiveTextColor() {
    return this.SettingsModule.menuActiveTextColor
  }

  get activeTag() {
    return this.TagsViewModule.activeTag
  }

  get activeMenu() {
    if (this.activeTag.norouter) {
      return this.activeTag.meta.activeMenu
    }
    const route = this.$route
    const { meta, path } = route
    if (meta && meta.activeMenu) {
      return meta.activeMenu
    }
    return path
  }

  get isCollapse() {
    return this.sidebar.collapse
  }
}
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}

.has-logo {
  .el-scrollbar {
    height: calc(100% - 200px);
  }

  .collapse + .el-scrollbar {
    height: calc(100% - 78px);
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
