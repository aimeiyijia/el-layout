<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView: showTagsView}" class="main-container">
      <div :class="{'fixed-header': fixedHeader}">
        <navbar
          @refresh="refresh"
          @logout="$emit('logout')"
          @single-refresh="handleRefreshSingle"
          @all-refresh="handleRefreshAll"
        >
          <template #rightMenu>
            <slot name="rightMenu" />
          </template>
        </navbar>
        <tags-view
          v-if="showTagsView && showBreadcrumb"
          @single-refresh="handleRefreshSingle"
          @all-refresh="handleRefreshAll"
        />
      </div>
      <app-main ref="appMain" />
    </div>
  </div>
</template>

<script lang="ts">
import '@/components/layout/styles/index.scss'
import defaultSettings, {
  ISettings,
  IStyCfg
} from './settings'

import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { RouteConfig } from 'vue-router'
import {
  DeviceType,
  AppModule,
  IAppState
} from '@/components/layout/store/modules/app'
import {
  SettingsModule,
  ISettingsState
} from '@/components/layout/store/modules/settings'
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/resize'
import cssVars from 'css-vars-ponyfill'

interface IConfig {
  routes: RouteConfig[]
  settings?: ISettings
  stycfg?: IStyCfg
}

@Component({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  }
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: () => [] }) readonly config!: IConfig

  public SettingsModule: ISettingsState = SettingsModule

  test = 0

  get classObj() {
    return {
      hideSidebar: this.device === DeviceType.Mobile && !this.sidebar.opened,
      collapseSidebar:
        this.device !== DeviceType.Mobile && this.sidebar.collapse,
      noCollapseSidebar:
        this.device !== DeviceType.Mobile && !this.sidebar.collapse,
      openSidebar: this.device === DeviceType.Mobile && this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile,
      pad: this.device === DeviceType.Pad,
      desktop: this.device === DeviceType.Desktop
    }
  }

  get showBreadcrumb() {
    return this.SettingsModule.showBreadcrumb
  }

  get showTagsView() {
    return this.SettingsModule.showTagsView
  }

  get fixedHeader() {
    return this.SettingsModule.fixedHeader
  }

  get sidebar() {
    return this.AppModule.sidebar
  }

  get device() {
    return this.AppModule.device
  }

  get appMain() {
    return this.$refs.appMain as AppMain
  }

  beforeMount() {
    const setting = Object.assign(
      defaultSettings,
      this.config.stycfg,
      this.config.settings
    )
    const variables = {}
    // 传入设置
    for (const key in setting) {
      variables[`--${key}`] = (setting as any)[key]
      this.SettingsModule.ChangeSetting({
        key: key,
        value: (setting as any)[key]
      })
    }
    cssVars({
      variables
    })
  }

  private handleClickOutside() {
    this.AppModule.CloseSideBar(false)
  }

  public handleRefreshSingle() {
    console.log(11)
    this.appMain.refreshSingle()
  }

  public handleRefreshAll() {
    this.appMain.refreshAll()
  }

  // 刷新页面
  public refresh() {}
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: '';
    display: table;
    clear: both;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  background-color: #f8f9ff;
  height: 100%;
  margin-left: var(--sideBarWidth, 250px);
  width: calc(100% - 54px);
  position: relative;
  transition: margin-left 0.3s, width 0.3s;
}

.sidebar-container {
  transition: width 0.28s;
  width: var(--sideBarWidth, 250px) !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - var(--sideBarWidth, 250px));
  transition: width 0.28s;
}

.desktop {
  &.collapseSidebar {
    .main-container {
      width: calc(100% - 54px);
      margin-left: 54px;
    }

    .sidebar-container {
      width: 54px !important;
    }

    .fixed-header {
      width: calc(100% - 54px);
    }
  }

  &.noCollapseSidebar {
    .main-container {
      width: calc(100% - var(--sideBarWidth, 250px));
      margin-left: var(--sideBarWidth, 250px);
    }
  }
}

.pad {
  .main-container {
    width: calc(100% - var(--sideBarWidth, 250px));
  }
  &.collapseSidebar {
    .main-container {
      width: calc(100% - 54px);
      margin-left: 54px;
    }

    .sidebar-container {
      width: 54px !important;
    }

    .fixed-header {
      width: calc(100% - 54px);
    }
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
    width: 100%;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: var(--sideBarWidth, 250px) !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(calc(var(--sideBarWidth, 250px) * -1), 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
