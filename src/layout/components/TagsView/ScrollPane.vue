<template>
  <div>
    <i
      v-if="isSwitchShow"
      class="el-icon-d-arrow-left switch"
      @click="handleSwitch('LEFT')"
    ></i>
    <el-scrollbar
      ref="scrollContainer"
      :vertical="false"
      :noresize="true"
      class="scroll-container"
      @wheel.native.prevent="handleScroll"
    >
      <slot />
    </el-scrollbar>
    <i
      v-if="isSwitchShow"
      class="el-icon-d-arrow-right switch"
      @click="handleSwitch('RIGHT')"
    ></i>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

const tagSpacing = 4

@Component({
  name: 'ScrollPane'
})
export default class extends Vue {
  public isSwitchShow = false

  get scrollWrapper() {
    return (this.$refs.scrollContainer as Vue).$refs.wrap as HTMLElement
  }

  get switchWidthOff(): number {
    const baseNum = 6
    const scrollContainerWidth: number = this.scrollWrapper.getBoundingClientRect()
      .width
    return scrollContainerWidth / baseNum
  }

  mounted() {
    this.scrollWrapper.addEventListener('scroll', this.emitScroll, true)
  }

  beforeDestroy() {
    this.scrollWrapper.removeEventListener('scroll', this.emitScroll)
  }

  private getStyle(ele: any, attr: any) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(ele, null)[attr]
    }
    return ele.currentStyle[attr]
  }

  private handleScroll(e: WheelEvent) {
    const eventDelta = (e as any).wheelDelta || -e.deltaY * 40
    const scrollWrapper = this.scrollWrapper
    scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + eventDelta / 4
  }

  private emitScroll() {
    this.$emit('scroll')
  }

  public moveToTarget(currentTag: HTMLElement) {
    const container = (this.$refs.scrollContainer as Vue).$el as HTMLElement
    const containerWidth = container.offsetWidth
    const scrollWrapper = this.scrollWrapper
    const tagList = this.$parent.$refs.tag as any[]

    let firstTag = null
    let lastTag = null

    // find first tag and last tag
    if (tagList.length > 0) {
      firstTag = tagList[0]
      lastTag = tagList[tagList.length - 1]
    }

    if (firstTag === currentTag) {
      scrollWrapper.scrollLeft = 0
    } else if (lastTag === currentTag) {
      scrollWrapper.scrollLeft = scrollWrapper.scrollWidth - containerWidth
    } else {
      // find preTag and nextTag
      const currentIndex = tagList.findIndex(item => item === currentTag)
      const prevTag = tagList[currentIndex - 1]
      const nextTag = tagList[currentIndex + 1]
      // the tag's offsetLeft after of nextTag
      const afterNextTagOffsetLeft =
        nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagSpacing
      // the tag's offsetLeft before of prevTag
      const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagSpacing

      if (afterNextTagOffsetLeft > scrollWrapper.scrollLeft + containerWidth) {
        scrollWrapper.scrollLeft = afterNextTagOffsetLeft - containerWidth
      } else if (beforePrevTagOffsetLeft < scrollWrapper.scrollLeft) {
        scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
      }
    }
  }

  private handleSwitch(direction: string) {
    const scrollWrapper = this.scrollWrapper
    const off = this.switchWidthOff
    if (direction === 'LEFT') {
      scrollWrapper.scrollLeft = scrollWrapper.scrollLeft - off
    } else {
      scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + off
    }
  }
}
</script>

<style lang="scss">
.scroll-container {
  .el-scrollbar__bar {
    bottom: 0px;
  }

  .el-scrollbar__wrap {
    height: 54px;
  }
  .el-scrollbar__thumb {
    background-color: rgba(144, 147, 153, 0.2);
  }
}
</style>

<style lang="scss" scoped>
.scroll-container {
  display: inline-block;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: calc(100% - 60px);
  vertical-align: middle;
}
.switch {
  height: 32px;
  font-size: 24px;
  padding-top: 6px;
  vertical-align: middle;
  background-color: #42b983;
  cursor: pointer;
  &:hover {
    // color: var(--tagActiveColor, #42b983);
  }
  &.el-icon-d-arrow-left {
    margin-right: 4px;
  }
  &.el-icon-d-arrow-right {
    margin-left: 4px;
  }
}
</style>
