<template>
  <div class="sidebar-logo-container" :class="{collapse: collapse}">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-link">
        <el-popover
          placement="bottom-start"
          width="400"
          trigger="hover"
          popper-class="sidebarPopover"
        >
          <div class="sidebar-desc">
            <div class="sidebar-desc_title">{{ title }}</div>
          </div>
          <img :src="logoUrl" class="sidebar-logo" slot="reference" />
        </el-popover>
      </div>
      <div v-else key="expand" class="sidebar-logo-link">
        <img :src="logoUrl" class="sidebar-logo" />
        <div class="sidebar-desc" v-if="!collapse">
          <div class="sidebar-desc_title">{{ title }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  SettingsModule,
  ISettingsState
} from '@/components/store/modules/settings'

@Component({
  name: 'SidebarLogo'
})
export default class extends Vue {
  @Prop({ required: true }) private collapse!: boolean

  public SettingsModule: ISettingsState = SettingsModule

  public title = '123456'
  public logoUrl = ''

  get platformName() {
    return this.SettingsModule.platformName
  }

  mounted() {
    // setInterval(() => {
    //   SettingsModule.SetPlatform('债权人')
    // }, 3000)
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 200px;
  line-height: 50px;
  background: var(--menuBgColor, #455cc7);
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    & .sidebar-logo {
      width: 72px;
      height: 83px;
      vertical-align: middle;
      margin-top: 12px;
      transition: all 0.1s;
    }
  }

  &.collapse {
    height: 78px;
    transition: all 0.1s;
    .sidebar-logo {
      width: 48px;
      height: 54px;
      margin-right: 0px;
      transition: all 0.1s;
    }
  }
}

// 写在外面是为了兼容 el-popover
.sidebar-desc {
  display: inline-block;
  margin: 0;
  color: #fff;
  line-height: 24px;
  font-size: 14px;
  vertical-align: middle;
  & .sidebar-desc_title {
    font-weight: 600;
    font-size: 18px;
  }
  & .sidebar-desc_entitle {
    font-size: 12px;
  }
  & .sidebar-desc_platform {
    color: #ff8370;
    font-size: 18px;
    // margin-top: 15px;
  }
}
</style>
