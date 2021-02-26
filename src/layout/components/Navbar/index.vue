<template>
  <div class="navbar" ref="navbar">
    <hamburger
      ref="hamburgerContainer"
      id="hamburger-container"
      :is-active="sidebar.opened"
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
    />
    <div class="right-menu" ref="rightMenu">
      <template v-if="device !== 'mobile'">
        <header-search class="right-menu-item" />
        <screenfull class="right-menu-item hover-effect" />
      </template>
      <span class="right-menu-item">
        <slot name="custominfo"></slot>
      </span>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu></el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/layout/store/modules/app'
import { SettingsModule } from '@/layout/store/modules/settings'
import TagsView from '@/layout/components/TagsView/index.vue'
import Breadcrumb from '@/layout/components/Breadcrumb/index.vue'
import Hamburger from '@/layout/components/Hamburger/index.vue'
import HeaderSearch from '@/layout/components/HeaderSearch/index.vue'
import Screenfull from '@/layout/components/Screenfull/index.vue'

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
  get navbar() {
    return this.$refs.navbar as Vue
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
    return this.$refs.rightMenu as Vue
  }

  get sidebar() {
    return AppModule.sidebar
  }

  get showBreadcrumb() {
    return SettingsModule.showBreadcrumb
  }

  get showTagsView() {
    return SettingsModule.showTagsView
  }

  get device() {
    return AppModule.device.toString()
  }

  mounted() {
    this.computeTagsViewWidth()
    // window.addEventListener(
    //   'resize',
    //   this.computeTagsViewWidth
    // )

    // 选择需要观察变动的节点
    const targetNode = this.rightMenu

    // 观察器的配置（需要观察什么变动）
    const config = { subtree: true, characterData: true }

    // 当观察到变动时执行的回调函数
    const callback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'characterData') {
          this.computeTagsViewWidth()
        }
      }
    }

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback)

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config)
  }

  beforeDestroy() {
    // window.removeEventListener('resize', this.computeTagsViewWidth)
  }

  private computeTagsViewWidth() {
    console.log(1)
    const tagsView = this.tagsView
    const navbarWidth = this.navbar && this.getElWidth(this.navbar)
    const hamburgerContainerWidth =
      this.hamburgerContainer && this.getElWidth(this.hamburgerContainer.$el)
    const breadcrumbWidth =
      (this.breadcrumb && this.getElWidth(this.breadcrumb.$el)) || 0
    const rightMenuWidth = this.rightMenu && this.getElWidth(this.rightMenu)
    const width =
      navbarWidth -
      hamburgerContainerWidth -
      breadcrumbWidth -
      rightMenuWidth +
      'px'
    tagsView.$el.style.width = width
  }

  private getElWidth(el: HTMLElement) {
    return el && el.getBoundingClientRect().width
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .tags-view-container {
    display: inline-block;
    width: calc(100% - 208px);
    border-bottom: none;
    box-shadow: none;
    position: relative;
    margin-top: 9px;
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

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
}
</style>
