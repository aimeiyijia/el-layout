<template>
  <el-layout :config="config"></el-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import layout from '@/layout/index.vue'
import { constantRoutes } from '@/router/index.ts'

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

<style scoped>
</style>
