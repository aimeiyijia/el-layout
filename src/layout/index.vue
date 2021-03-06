<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div
      :class="{hasTagsView: showTagsView, sidebarOpen: sidebar.opened}"
      class="main-container"
    >
      <div :class="{'fixed-header': fixedHeader}">
        <navbar @refresh="refresh" >
          <template #custominfo>
            <div>
              {{ test }}
            </div>
          </template>
        </navbar>
        <tags-view v-if="showTagsView && showBreadcrumb" @refresh="refresh" />
      </div>
      <app-main ref="appMain" />
    </div>
  </div>
</template>

<script lang="ts">
import '@/layout/styles/index.scss'
import defaultSettings, { ISettings, IStyCfg } from '@/layout/settings'

import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { RouteConfig } from 'vue-router'
import { DeviceType, AppModule, IAppState } from '@/layout/store/modules/app'
import { SettingsModule, ISettingsState } from '@/layout/store/modules/settings'
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/resize'

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

  private AppModule: IAppState = AppModule
  private SettingsModule: ISettingsState = SettingsModule

  test = 0

  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile
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

  get appMain() {
    return this.$refs.appMain as Vue
  }

  beforeMount() {
    const setting = Object.assign(
      defaultSettings,
      this.config.stycfg,
      this.config.settings
    )
    // 传入设置
    for (const key in setting) {
      this.SettingsModule.ChangeSetting({
        key: key,
        value: (setting as any)[key]
      })
    }
  }

  mounted() {
    // setInterval(() => {
    //   this.test += 1000
    // }, 100)
  }

  private handleClickOutside() {
    this.AppModule.CloseSideBar(false)
  }

  private refresh() {
    console.log(this.appMain.reload())
  }
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
  min-height: 100%;
  margin-left: var(--sideBarWidth, 210px);
  width: calc(100% - 54px);
  position: relative;
  &.sidebarOpen {
    width: calc(100% - 210px);
  }
}

.sidebar-container {
  transition: width 0.28s;
  width: var(--sideBarWidth, 210px) !important;
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
  width: calc(100% - var(--sideBarWidth, 210px));
  transition: width 0.28s;
}

.hideSidebar {
  .main-container {
    margin-left: 54px;
  }

  .sidebar-container {
    width: 54px !important;
  }

  .fixed-header {
    width: calc(100% - 54px);
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: var(--sideBarWidth, 210px) !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(calc(var(--sideBarWidth, 210px) * -1), 0, 0);
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
