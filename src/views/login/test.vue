
<template>
  <div class="login-container">
    <el-button @click="handleGoAdmin">隐藏菜单-测试页面</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'Test'
})
export default class extends Vue {
  handleGoAdmin() {
    location.replace('/admin/#')
  }
}
</script>

<style lang="scss"></style>
