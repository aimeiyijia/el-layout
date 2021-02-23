<template>
  <el-layout :config="config"></el-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import layout from '@/layout/index.vue'
import { constantRoutes } from '@/router/index.ts'

@Component({
  name: 'layouttest'
})
export default class extends Vue {
  get config() {
    console.log(constantRoutes, '路由')
    return {
      routes: constantRoutes,
      stycfg: {
        sideBarWidth: '210px'
      }
    }
  }
}
</script>

<style scoped>
</style>
