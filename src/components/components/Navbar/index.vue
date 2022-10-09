<template>
  <div class="navbar" ref="navbar">
    <hamburger
      ref="hamburgerContainer"
      id="hamburger-container"
      :is-active="device === 0 ? sidebar.opened : !sidebar.collapse"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <breadcrumb
      ref="breadcrumb"
      v-if="showBreadcrumb"
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <tags-view
      ref="tagsView"
      v-if="showTagsView && !showBreadcrumb"
      @refresh="$emit('refresh')"
      @single-refresh="$emit('single-refresh')"
      @all-refresh="$emit('all-refresh')"
    />
    <div class="right-menu" ref="rightMenu">
      <slot name="rightMenu" />
      <!-- 退出 -->
      <div class="btns">
        <div class="logout" @click="logout">退出</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import debounce from 'lodash/debounce'
import {
  addResizeListener,
  removeResizeListener
} from 'element-ui/src/utils/resize-event'
import { Component, Emit, Vue, Watch } from 'vue-property-decorator'
import {
  AppModule,
  DeviceType,
  IAppState
} from '@/components/store/modules/app'
import {
  SettingsModule,
  ISettingsState
} from '@/components/store/modules/settings'
import TagsView from '@/components/components/TagsView/index.vue'
import Breadcrumb from '@/components/components/Breadcrumb/index.vue'
import Hamburger from '@/components/components/Hamburger/index.vue'
import HeaderSearch from '@/components/components/HeaderSearch/index.vue'
import Screenfull from '@/components/components/Screenfull/index.vue'

@Component({
  name: 'Navbar',
  components: {
    TagsView,
    Breadcrumb,
    Hamburger,
    HeaderSearch,
    Screenfull
  }
})
export default class extends Vue {
  private AppModule: IAppState = AppModule
  private SettingsModule: ISettingsState = SettingsModule
  private observer: any = null
  get navbar() {
    return this.$refs.navbar as HTMLElement
  }

  get hamburgerContainer() {
    return this.$refs.hamburgerContainer as Vue
  }

  get breadcrumb() {
    return this.$refs.breadcrumb as Vue
  }

  get tagsView() {
    return this.$refs.tagsView as Vue
  }

  get rightMenu() {
    return this.$refs.rightMenu as HTMLElement
  }

  get sidebar() {
    return this.AppModule.sidebar
  }

  get showBreadcrumb() {
    return this.SettingsModule.showBreadcrumb
  }

  get showTagsView() {
    return this.SettingsModule.showTagsView
  }

  get device() {
    return this.AppModule.device
  }

  @Watch('sidebar', { deep: true })
  private sidebarStatusChanged() {
    // console.log('需要重新计算')
  }

  private mounted() {
    this.computeTagsViewWidth()
    addResizeListener(this.rightMenu, this.computeTagsViewWidth)
    addResizeListener(window.document.body, this.computeTagsViewWidth)
  }

  private beforeDestroy() {
    removeResizeListener(this.rightMenu, this.computeTagsViewWidth)
  }

  private computeTagsViewWidth() {
    const tagsViewEl = this.tagsView.$el as HTMLElement
    const navbarWidth = this.navbar && this.getElWidth(this.navbar)
    const hamburgerContainerWidth =
      this.hamburgerContainer &&
      this.getElWidth(this.hamburgerContainer.$el as HTMLElement)
    const breadcrumbWidth =
      (this.breadcrumb &&
        this.getElWidth(this.breadcrumb.$el as HTMLElement)) ||
      0
    const rightMenuWidth = this.rightMenu && this.getElWidth(this.rightMenu)
    // console.log(this.rightMenu, '右侧菜单元素')
    // console.log(rightMenuWidth, '右侧菜单宽')
    // console.log(navbarWidth, 'navbarWidth')
    // console.log(hamburgerContainerWidth, 'hamburgerContainerWidth')
    const width =
      navbarWidth -
      hamburgerContainerWidth -
      breadcrumbWidth -
      rightMenuWidth -
      2 +
      'px'
    tagsViewEl.style.width = width
  }

  private getElWidth(el: HTMLElement) {
    return el && el.getBoundingClientRect().width
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
    if (this.device === 0) {
      AppModule.CloseCollapse()
    } else {
      AppModule.ToggleCollapse()
    }
  }

  // 退出
  private logout() {
    this.$msgbox
      .confirm('确定退出吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.$emit('logout')
      })
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  border-bottom: 1px solid #e1e4f8;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .hamburger-container {
    line-height: 42px;
    height: 100%;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: inline-flex;
    overflow: hidden;
    height: 100%;
    line-height: 50px;
    font-size: 14px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .btns {
    display: flex;
    flex-flow: row nowrap;
  }

  .logout {
    padding-left: 18px;
    margin-right: 15px;
    margin-left: 15px;
    width: 50px;
    height: 48px;
    cursor: pointer;
  }
}
</style>
