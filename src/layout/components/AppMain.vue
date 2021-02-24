<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews" v-if="!activeTag.norouter && isRouterAlive">
        <router-view :key="key" />
      </keep-alive>
      <Component v-else-if="activeTag.norouter && isRouterAlive" :is="activeTag.component"></Component>
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TagsViewModule } from '@/layout/store/modules/tags-view'

@Component({
  name: 'AppMain'
})
export default class extends Vue {
  isRouterAlive= true
  get cachedViews() {
    return TagsViewModule.cachedViews
  }

  get key() {
    return this.$route.path
  }

  get activeTag() {
    return TagsViewModule.activeTag
  }

  reload() {
    console.log(this.$route)
    this.isRouterAlive = false
    this.$nextTick(() => (this.isRouterAlive = true))
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>
