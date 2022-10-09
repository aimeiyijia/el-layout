<template>
  <el-layout :config="config"></el-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import layout from '@/layout/index.vue'
import { constantRoutes } from '@/router'

import {
  LPermissionModule,
} from '@/components/install'

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
    LPermissionModule.GenerateRoutes(constantRoutes)
  }
}
</script>

<style lang="scss"></style>
