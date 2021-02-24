<template>
  <el-layout :config="config"></el-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import layout from '@/layout/index.vue'
import { constantRoutes } from '@/router/index.ts'

import { PassengerStoreModule } from '@/store/modules/passenger'
import { AppModule } from '@/layout/index'

@Component({
  name: 'layouttest'
})
export default class extends Vue {
  get config() {
    return {
      routes: constantRoutes,
      stycfg: {
        sideBarWidth: '210px'
      }
    }
  }

  created() {
    console.log(AppModule, '----')
    // console.log(PassengerStoreModule.loginInfo) // state
    // console.log(PassengerStoreModule.userNumber) // getter
    // PassengerStoreModule.getZhangsan() // actions
    // PassengerStoreModule.getLisi() // actions
  }
}
</script>

<style scoped>
</style>
