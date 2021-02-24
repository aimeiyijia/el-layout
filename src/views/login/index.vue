
<template>
  <div class="login-container">
    {{ $route.name }} {{ new Date().getTime() }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'Login'
})
export default class extends Vue {
  handleGoAdmin() {
    location.replace('/admin/#')
  }
}
</script>

<style lang="scss"></style>
