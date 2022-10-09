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
import { AppModule, IAppState } from '@/components/layout/store/modules/app'
import {
  TagsViewModule,
  ITagsViewState
} from '@/components/layout/store/modules/tags-view'
import {
  PermissionModule,
  IPermissionState
} from '@/components/layout/store/modules/permission'
import {
  SettingsModule,
  ISettingsState
} from '@/components/layout/store/modules/settings'
import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'
import { UserModule } from '@/store/modules/user'
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
    const routes = _.cloneDeep(this.PermissionModule.routes)
    const { userInfo } = UserModule
    const { userRoleCode } = userInfo
    if (userRoleCode === 'glr') {
      const { isMajor } = userInfo.orgnizationUser
      const userType = userInfo.orgnizationUser.orgnazationType
      if (isMajor === 0 || (isMajor === 1 && userType === 3)) {
        for (let i = 0; i < routes.length; i++) {
          if (routes[i].path === '/?12') {
            console.log(i)
            routes.splice(i, 1)
          }
        }
      }
      // isqsz  0 工作组 1 清算组
      const { tuWtjg } = userInfo
      const { isqsz } = tuWtjg
      if (isqsz === 1) {
        for (let i = 0; i < routes.length; i++) {
          if (routes[i].path === '/?12') {
            for (
              let j = 0;
              j < (routes[i].children as RouteConfig[]).length;
              j++
            ) {
              if (
                (routes[i].children as RouteConfig[])[j].path === '/userReview'
              ) {
                (routes[i].children as RouteConfig[]).splice(j, 1)
              }
            }
          }
        }
      }
      // userType 2 机构管理人 3 个人管理人 4 普通用户 5 清算组成员
      // 个人管理人 | 清算组成员 不显示 指定负责人申请
      if (userType === 3 || userType === 5) {
        routes.forEach(item => {
          if (item.path === '/?2') {
            for (let i = 0; i < (item.children as RouteConfig[]).length; i++) {
              if ((item.children as RouteConfig[])[i].path === '/chargepersonList') {
                (item.children as RouteConfig[]).splice(i, 1)
              }
            }
          }
        })
      }
    } else if (userRoleCode === 'xhr') {
      // associationType 1-协会负责人 2-协会工作人员
      const { associationType } = userInfo.associationUserEntity
      if (associationType !== 1) {
        for (let i = 0; i < routes.length; i++) {
          if (routes[i].path === '/?11') {
            routes.splice(i, 1)
          }
        }
      }
    }
    return routes
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
