<template>
  <div id="tags-view-container" class="tags-view-container">
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
import { AppModule, IAppState } from '@/layout/store/modules/app'
import { PermissionModule } from '@/layout/store/modules/permission'
import { TagsViewModule, ITagView } from '@/layout/store/modules/tags-view'
import { Scrollbar as ElScrollbar } from 'element-ui'
import ScrollPane from './ScrollPane.vue'
import Contextmenu from 'vue-contextmenujs'
import Test from '@/views/login/test.vue'
Vue.use(Contextmenu)

@Component({
  name: 'TagsView',
  components: {
    ScrollPane
  }
})
export default class extends Vue {
  private AppModule: IAppState = AppModule
  private visible = false
  private top = 0
  private left = 0
  private selectedTag: ITagView = {}
  private affixTags: ITagView[] = []

  get scrollContainer() {
    return (this.$refs.scrollPane as Vue).$refs.scrollContainer as ElScrollbar
  }

  get scrollPane() {
    return this.$refs.scrollPane as Vue
  }

  get visitedViews() {
    return TagsViewModule.visitedViews
  }

  get activeTag() {
    return TagsViewModule.activeTag
  }

  get routes() {
    return PermissionModule.routes
  }

  get sidebar() {
    return this.AppModule.sidebar
  }

  @Watch('$route', { deep: true })
  private onRouteChange() {
    this.addTags()
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

    setTimeout(() => {
      console.log('即将添加非路由tag')
      TagsViewModule.addView({
        norouter: true,
        name: '1',
        component: Test,
        meta: {
          title: 123,
          activeMenu: '/permission/directive01'
        }
      })
    }, 3000)
  }

  beforeDestroy() {
    window.removeEventListener('resize', _.debounce(this.scrollUpdate, 150))
  }

  // 右键菜单
  onContextmenu(tag: ITagView, event: MouseEvent) {
    const selectedTag = tag
    this.selectedTag = tag
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
    console.log('更新')
    this.$nextTick(function() {
      this.scrollContainer.update()
      this.isSwitchShow()
    })
  }

  private isSwitchShow() {
    const scrollContainerWidth = this.scrollContainer.$el.getBoundingClientRect()
      .width

    const tags: HTMLCollection[] = this.scrollPane.$el.getElementsByClassName(
      'tags-view-item'
    )
    let tagsWidth = 0
    tags.forEach(o => {
      const elWidth = o.getBoundingClientRect().width
      tagsWidth = elWidth + tagsWidth
    })
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

  private setActiveTag(tag) {
    TagsViewModule.addView(tag)
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
        TagsViewModule.addVisitedView(tag)
      }
    }
  }

  private addTags() {
    const { name } = this.$route
    if (name) {
      TagsViewModule.addView(this.$route)
    }
    this.scrollUpdate()
    return false
  }

  private moveToCurrentTag() {
    const tags = this.$refs.tag as any[] // TODO: better typescript support for router-link
    this.$nextTick(() => {
      for (const tag of tags) {
        if ((tag.to as ITagView).path === this.$route.path) {
          (this.$refs.scrollPane as ScrollPane).moveToTarget(tag as any)
          // When query is different then update
          if ((tag.to as ITagView).fullPath !== this.$route.fullPath) {
            TagsViewModule.updateVisitedView(this.$route)
          }
          break
        }
      }
    })
  }

  private refreshSelectedTag(view: ITagView) {
    TagsViewModule.delCachedView(view)
    const { fullPath } = view
    this.scrollUpdate()
    this.$emit('refresh')
    // this.$nextTick(() => {
    //   this.$router
    //     .replace({
    //       path: fullPath
    //     })
    //     .catch(err => {
    //       console.warn(err)
    //     })
    // })
  }

  private closeSelectedTag(view: ITagView) {
    TagsViewModule.delView(view)
    if (this.isActive(view)) {
      this.toLastView(TagsViewModule.visitedViews, view)
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
    TagsViewModule.delOthersViews(this.selectedTag)
    this.moveToCurrentTag()
    this.scrollUpdate()
  }

  private closeAllTags(view: ITagView) {
    TagsViewModule.delAllViews()
    if (this.affixTags.some(tag => tag.path === this.$route.path)) {
      return
    }
    this.toLastView(TagsViewModule.visitedViews, view)
  }

  private toLastView(visitedViews: ITagView[], view: ITagView) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView !== undefined && latestView.fullPath !== undefined) {
      this.$router.push(latestView.fullPath).catch(err => {
        console.warn(err)
      })
    } else {
      // Default redirect to the home page if there is no tags-view, adjust it if you want
      if (view.name === 'Dashboard') {
        // to reload home page
        this.$router
          .replace({ path: '/redirect' + view.fullPath })
          .catch(err => {
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
  height: 33px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

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
