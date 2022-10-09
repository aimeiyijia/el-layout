<template>
  <section class="app-main" ref="appMain">
    <el-scrollbar :noresize="false" ref="scrollContainer">
      <!--  name="fade-transform" mode="out-in" -->
      <transition>
        <keep-alive
          :include="cachedViews"
          v-if="!activeTag.norouter && allRefresh"
        >
          <router-view v-if="singleRefresh" :key="key" />
        </keep-alive>
        <Component
          v-else-if="activeTag.norouter && singleRefresh"
          :is="activeTag.component"
          :data="activeTag.data"
        ></Component>
      </transition>
    </el-scrollbar>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { addListener, removeListener } from 'resize-detector'
import _ from 'lodash'
import {
  TagsViewModule,
  ITagsViewState
} from '@/components/store/modules/tags-view'

@Component({
  name: 'AppMain'
})
export default class extends Vue {
  public TagsViewModule: ITagsViewState = TagsViewModule

  public allRefresh = true
  public singleRefresh = true

  get scrollContainer() {
    return this.$refs.scrollContainer as any
  }

  get appMain() {
    return this.$refs.appMain as HTMLElement
  }

  get cachedViews() {
    const dynamicCachedViews = this.TagsViewModule.cachedViews
    const defaultCachedViews = this.TagsViewModule.defaultCachedViews
    return dynamicCachedViews.concat(defaultCachedViews)
  }

  get key() {
    return this.$route.path
  }

  get activeTag() {
    return this.TagsViewModule.activeTag
  }

  mounted() {
    addListener(this.appMain, _.debounce(this.scrollUpdate, 150))
  }

  beforeDestroy() {
    removeListener(this.appMain, _.debounce(this.scrollUpdate, 150))
  }

  // 触发滚动条的更新事件
  private scrollUpdate() {
    this.$nextTick(function() {
      this.scrollContainer.update()
    })
  }

  refreshSingle() {
    console.log('刷新单个')
    this.singleRefresh = false
    this.$nextTick(() => (this.singleRefresh = true))
  }

  refreshAll() {
    console.log('刷新全部')
    this.allRefresh = false
    this.$nextTick(() => (this.allRefresh = true))
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: calc(100% - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  // padding: 16px 20px;
  .el-scrollbar {
    height: 100%;
  }

  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  ::v-deep .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>
