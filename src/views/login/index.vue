
<template>
  <div class="login-container">
    <el-button @click="handleGoAdmin">管理员端</el-button>
    <el-button>债权人端</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'Login',
})
export default class extends Vue {
  handleGoAdmin(){
    location.replace("/admin/#")
  }
}
</script>

<style lang="scss"></style>
