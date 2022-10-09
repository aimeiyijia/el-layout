<template>
  <div id="tags-view-container" class="tags-view-container" ref="tagsView">
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <template v-for="tag in visitedViews">
        <router-link
          ref="tag"
          v-if="!tag.norouter"
          :key="tag.path"
          :class="isActive(tag) ? 'active' : ''"
          :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}"
          tag="span"
          class="tags-view-item"
          @click.native="setActiveTag(tag)"
          @contextmenu.prevent.native="onContextmenu(tag, $event)"
        >
          {{ tag.meta.title }}
          <span
            v-if="!isAffix(tag)"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </router-link>
        <span
          v-else
          :key="tag.name"
          :class="isActive(tag) ? 'active' : ''"
          class="tags-view-item"
          @click="setActiveTag(tag)"
          @contextmenu.prevent="onContextmenu(tag, $event)"
        >
          {{ tag.meta.title }}
          <span
            v-if="!isAffix(tag)"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </span>
      </template>
    </scroll-pane>
  </div>
</template>

<script lang="ts">
import path from 'path'
import _ from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { AppModule, IAppState } from '@/components/layout/store/modules/app'
import {
  PermissionModule,
  IPermissionState
} from '@/components/layout/store/modules/permission'
import {
  TagsViewModule,
  ITagView,
  ITagsViewState
} from '@/components/layout/store/modules/tags-view'
import {
  SettingsModule,
  ISettingsState
} from '@/components/layout/store/modules/settings'
import ScrollPane from './ScrollPane.vue'
import Contextmenu from 'vue-contextmenujs'
Vue.use(Contextmenu)

@Component({
  name: 'TagsView',
  components: {
    ScrollPane
  }
})
export default class extends Vue {
  private AppModule: IAppState = AppModule
  private PermissionModule: IPermissionState = PermissionModule
  private TagsViewModule: ITagsViewState = TagsViewModule
  private SettingsModule: ISettingsState = SettingsModule
  private visible = false
  private top = 0
  private left = 0
  private selectedTag: ITagView = { meta: {} }
  private affixTags: ITagView[] = []

  get scrollContainer() {
    return (this.$refs.scrollPane as any).$children[0]
  }

  get scrollPane() {
    return this.$refs.scrollPane as Vue
  }

  get visitedViews() {
    return this.TagsViewModule.visitedViews
  }

  get activeTag() {
    return this.TagsViewModule.activeTag
  }

  get routes() {
    return this.PermissionModule.routes
  }

  get sidebar() {
    return this.AppModule.sidebar
  }

  get tagsViewMaxNum() {
    return SettingsModule.tagsViewMaxNum
  }

  @Watch('$route', { deep: true })
  private onRouteChange() {
    // const { name } = this.$route
    // if (name) {
    //   this.TagsViewModule.addView(this.$route as ITagView)
    // }
    const curRoute = this.$route
    this.addTags()

    if (this.visitedViews.length > this.tagsViewMaxNum) {
      const willOpenRoute = this.$route
      this.closeSelectedTag(curRoute as ITagView)
      this.$confirm('打开标签页过多，是否关闭其他标签页？', '温馨提示', {
        showClose: false,
        distinguishCancelAndClose: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      })
        .then(() => {
          this.addTags(willOpenRoute as ITagView)
          this.TagsViewModule.delOthersViews(willOpenRoute as ITagView)
          this.toLastView(
            this.TagsViewModule.visitedViews,
            willOpenRoute as ITagView
          )
          this.scrollUpdate()
        })
        .catch(() => {
          // this.closeSelectedTag(lastRoute as ITagView)
        })
    }

    this.moveToCurrentTag()
  }

  @Watch('visible')
  private onVisibleChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu)
    } else {
      document.body.removeEventListener('click', this.closeMenu)
    }
  }

  @Watch('sidebar', { deep: true })
  private sidebarStatusChanged() {
    this.scrollUpdate()
  }

  mounted() {
    this.initTags()
    this.addTags()
    window.addEventListener('resize', _.debounce(this.scrollUpdate, 150))

    // 暴露给外部操作tags的方法
    this.TagsViewModule.setOperateTagsMethods({
      add: this.addTags,
      refresh: this.refreshSelectedTag,
      close: this.closeSelectedTag,
      closeOthers: this.closeOthersTags,
      closeAll: this.closeAllTags,
      update: this.updateTag
    })
  }

  beforeDestroy() {
    window.removeEventListener('resize', _.debounce(this.scrollUpdate, 150))
  }

  private async checkIsTagsNumMoreMaxTagsNum() {
    console.log(this.visitedViews)
    console.log(this.tagsViewMaxNum)
    const lastVisitedViews = this.visitedViews[this.visitedViews.length - 1]
    console.log(lastVisitedViews, '最后一个标签')
    // 返回已经访问过的标签，不进行拦截
    // const { path } = this.$route
    // const result = this.visitedViews.some(o => o.path === path)
    // console.log(result, '结果')
    // if (result) return true
    if (this.visitedViews.length > this.tagsViewMaxNum) {
      try {
        const checkResult = await this.$confirm(
          '打开标签页过多，是否关闭其他标签页？',
          '温馨提示',
          {
            showClose: false,
            distinguishCancelAndClose: true,
            confirmButtonText: '是',
            cancelButtonText: '否'
          }
        )
        console.log('是')
        this.$router.go(-1)
      } catch (error) {
        console.log('否')
        this.addTags()
      }
      return false
    }
    return true
  }

  // 右键菜单
  private onContextmenu(tag: ITagView, event: MouseEvent) {
    const selectedTag = tag
    this.selectedTag = tag
    console.log(this.selectedTag, '选中de')
    this.$contextmenu({
      items: [
        {
          label: '刷新',
          disabled: !this.isActive(selectedTag),
          onClick: () => {
            this.refreshSelectedTag(selectedTag)
          }
        },
        {
          label: '刷新全部',
          disabled: !this.isActive(selectedTag),
          onClick: () => {
            this.refreshAllTag()
          }
        },
        {
          label: '关闭',
          disabled: this.isAffix(selectedTag),
          onClick: () => {
            this.closeSelectedTag(selectedTag)
          }
        },
        {
          label: '关闭其它',
          disabled: !this.isActive(selectedTag),
          onClick: () => {
            this.closeOthersTags()
          }
        },
        {
          label: '关闭全部',
          onClick: () => {
            this.closeAllTags(selectedTag)
          }
        }
      ],
      event,
      // x: event.clientX,
      // y: event.clientY,
      customClass: 'custom-class noContextmenuIcon',
      zIndex: 3,
      minWidth: 82
    })
    return false
  }

  // 触发滚动条的更新事件
  private scrollUpdate(): void {
    // console.log('更新')
    this.$nextTick(function() {
      // console.log(this.scrollContainer.$children[0].update())
      // this.scrollContainer.update()
      this.scrollContainer.update()
      this.isSwitchShow()
    })
  }

  private isSwitchShow() {
    const scrollContainerWidth =
      this.scrollContainer.$el.getBoundingClientRect().width

    const tags = this.scrollPane.$el.getElementsByClassName('tags-view-item')

    if (tags.length <= 0) return

    let tagsWidth = 0

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i] as HTMLElement
      const elWidth = tag.getBoundingClientRect().width
      tagsWidth = elWidth + tagsWidth
    }
    // tag平均宽度
    const tagAverageWidth = tagsWidth / this.visitedViews.length
    // 当容器宽与总tag元素宽相差半个tag平均宽度时显示左右切换
    if (scrollContainerWidth - tagsWidth < tagAverageWidth / 4) {
      (this.scrollPane as ScrollPane).isSwitchShow = true
      this.moveToCurrentTag()
    } else {
      (this.scrollPane as ScrollPane).isSwitchShow = false
      this.moveToCurrentTag()
    }
  }

  private setActiveTag(tag: ITagView) {
    this.TagsViewModule.addView(tag)
  }

  private isActive(route: ITagView) {
    if (route.norouter) {
      return route.name === this.activeTag.name
    }
    return route.path === this.activeTag.path
  }

  private isAffix(tag: ITagView) {
    return tag.meta && tag.meta.affix
  }

  private filterAffixTags(routes: RouteConfig[], basePath = '/') {
    let tags: ITagView[] = []
    routes.forEach(route => {
      if (route.meta && route.meta.affix) {
        const tagPath = path.resolve(basePath, route.path)
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta }
        })
      }
      if (route.children) {
        const childTags = this.filterAffixTags(route.children, route.path)
        if (childTags.length >= 1) {
          tags = [...tags, ...childTags]
        }
      }
    })
    return tags
  }

  private initTags() {
    this.affixTags = this.filterAffixTags(this.routes)
    for (const tag of this.affixTags) {
      // Must have tag name
      if (tag.name) {
        this.TagsViewModule.addVisitedView(tag)
      }
    }
  }

  private updateTag(path: string, tagConfig: ITagView) {
    // this.$nextTick is not working
    const timer = setTimeout(() => {
      clearTimeout(timer)
      for (let v of this.visitedViews) {
        if (v.path === path) {
          v = Object.assign(v, tagConfig)
          break
        }
      }
    }, 10)
  }

  private addTags(view?: ITagView) {
    if (view) {
      this.TagsViewModule.addView(view)
      return
    }
    const { name } = this.$route
    if (name) {
      this.TagsViewModule.addView(this.$route as ITagView)
    }
    this.scrollUpdate()
    return false
  }

  private moveToCurrentTag() {
    const tags = this.$refs.tag as any[]
    this.$nextTick(() => {
      for (const tag of tags) {
        if ((tag.to as ITagView).path === this.$route.path) {
          (this.$refs.scrollPane as ScrollPane).moveToTarget(tag as any)
          // When query is different then update
          if ((tag.to as ITagView).fullPath !== this.$route.fullPath) {
            this.TagsViewModule.updateVisitedView(this.$route as ITagView)
          }
          break
        }
      }
    })
  }

  private refreshSelectedTag(view: ITagView) {
    this.TagsViewModule.delCachedView(view)
    const { fullPath } = view
    this.scrollUpdate()
    console.log(1234)
    this.$emit('single-refresh')
  }

  private refreshAllTag() {
    this.scrollUpdate()
    this.$emit('all-refresh')
  }

  private closeSelectedTag(view: ITagView) {
    this.TagsViewModule.delView(view)
    if (this.isActive(view)) {
      this.toLastView(this.TagsViewModule.visitedViews, view)
    }
    this.scrollUpdate()
  }

  private closeOthersTags() {
    if (
      this.selectedTag.fullPath !== this.$route.path &&
      this.selectedTag.fullPath !== undefined
    ) {
      this.$router.push(this.selectedTag.fullPath).catch(err => {
        console.warn(err)
      })
    }
    this.TagsViewModule.delOthersViews(this.selectedTag)
    this.moveToCurrentTag()
    this.scrollUpdate()
  }

  private closeAllTags(view: ITagView) {
    this.TagsViewModule.delAllViews()
    if (this.affixTags.some(tag => tag.path === this.$route.path)) {
      return
    }
    this.toLastView(this.TagsViewModule.visitedViews, view)
  }

  private toLastView(visitedViews: ITagView[], view: ITagView) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView !== undefined && latestView.fullPath !== undefined) {
      this.$router.push(latestView.fullPath).catch(err => {
        console.warn(err)
      })
    } else {
      // Default redirect to the home page if there is no tags-view, adjust it if you want
      if (view.name === 'Desktop') {
        // to reload home page
        this.$router.replace({ path: view.fullPath }).catch(err => {
          console.warn(err)
        })
      } else {
        this.$router.push('/').catch(err => {
          console.warn(err)
        })
      }
    }
    this.scrollUpdate()
  }

  private openMenu(tag: ITagView, e: MouseEvent) {
    const menuMinWidth = 105
    const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
    const offsetWidth = (this.$el as HTMLElement).offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX - offsetLeft + 15 // 15: margin right
    if (left > maxLeft) {
      this.left = maxLeft
    } else {
      this.left = left
    }
    this.top = e.clientY
    this.visible = true
    this.selectedTag = tag
  }

  private closeMenu() {
    this.visible = false
  }

  private handleScroll() {
    this.closeMenu()
  }
}
</script>

<style lang="scss">
.noContextmenuIcon .menu_item .menu_item_expand_icon {
  display: none;
}
// Reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.tags-view-container {
  display: inline-block;
  position: relative;
  height: 33px;
  width: 100%;
  background: #fff;
  flex-grow: 2;

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 0px;
      }

      &:last-of-type {
        margin-right: 0px;
      }

      &.active {
        background-color: var(--tagActiveColor, #42b983);
        color: #fff;
        border-color: var(--tagActiveColor, #42b983);

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
}
</style>
