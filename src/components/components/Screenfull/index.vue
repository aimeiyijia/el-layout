<template>
  <div id="screenfull">
    <svg-icon
      :name="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="handleFullScreenClick"
    />
  </div>
</template>

<script lang="ts">
import SvgIcon from 'vue-svgicon'
import screenfull from 'screenfull'
import { Component, Vue } from 'vue-property-decorator'

const sf = screenfull

@Component({
  name: 'Screenfull',
  components: { SvgIcon }
})
export default class extends Vue {
  private isFullscreen = false;

  mounted() {
    if (sf.isEnabled) {
      sf.on('change', this.change)
    }
  }

  beforeDestory() {
    if (sf.isEnabled) {
      sf.off('change', this.change)
    }
  }

  private change() {
    if (sf.isEnabled) {
      this.isFullscreen = sf.isFullscreen
    }
  }

  private handleFullScreenClick(): void | boolean {
    if (!sf.isEnabled) {
      this.$message({
        message: 'you browser can not work',
        type: 'warning'
      })
      return false
    }
    sf.toggle()
  }
}
</script>
