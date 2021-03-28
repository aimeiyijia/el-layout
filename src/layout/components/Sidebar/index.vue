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
import { Component, Vue } from 'vue-property-decorator'
import { AppModule, IAppState } from '@/layout/store/modules/app'
import { TagsViewModule } from '@/layout/store/modules/tags-view'
import { PermissionModule } from '@/layout/store/modules/permission'
import { SettingsModule } from '@/layout/store/modules/settings'
import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'

@Component({
  name: 'SideBar',
  components: {
    SidebarItem,
    SidebarLogo
  }
})
export default class extends Vue {
private AppModule: IAppState = AppModule

get sidebar() {
  return this.AppModule.sidebar
}

get routes() {
  return PermissionModule.routes
}

get showLogo() {
  return SettingsModule.showSidebarLogo
}

get menuBgColor() {
  return SettingsModule.menuBgColor
}

get menuTextColor() {
  return SettingsModule.menuTextColor
}

get menuActiveTextColor() {
  return SettingsModule.menuActiveTextColor
}

get activeTag() {
  return TagsViewModule.activeTag
}

get activeMenu() {
  const route = this.$route
  const { meta, path } = route
  if (this.activeTag.norouter) {
    console.log(this.activeTag.meta.activeMenu, '2')
    return this.activeTag.meta.activeMenu
  }
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
}

get isCollapse() {
  console.log(this.sidebar.opened, '开启')
  return !this.sidebar.opened
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
    height: calc(100% - 50px);
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
