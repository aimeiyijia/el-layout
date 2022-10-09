<template>
  <el-layout :config="config"></el-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import layout from '@/layout/index.vue'
import { constantRoutes } from '@/router'

import {
  AppModule,
  PermissionModule,
  SettingsModule,
  TagsViewModule
} from '@/layout/index.js'

@Component({
  name: 'layouttest'
})
export default class extends Vue {
  get config() {
    return {
      stycfg: {
        sideBarWidth: '210px'
      }
    }
  }

  created() {
    PermissionModule.GenerateRoutes(constantRoutes)
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
}
#app {
  height: calc(100% - 48px);
  padding: 24px;
}
</style>
