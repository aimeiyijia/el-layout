import { observable, action } from 'mobx'
import { Route } from 'vue-router'
import { Component, Vue } from 'vue-property-decorator'
import _ from 'lodash'

export interface ITagView extends Partial<Route> {
  title?: string
  norouter?: boolean
  component?: any
  data?: any
  meta: {
    activeMenu?: string
    title?: string
    noCache?: boolean
    affix?: boolean
  }
}

export interface ITagsViewState {
  visitedViews: ITagView[]
  defaultCachedViews: (string | undefined)[]
  cachedViews: (string | undefined)[]
  activeTag: ITagView
  operateTagsMethods: any
  addView: (tag: ITagView) => void
  addVisitedView: (tag: ITagView) => void
  updateVisitedView: (tag: ITagView) => void
  delCachedView: (tag: ITagView) => void
  delView: (tag: ITagView) => void
  delOthersViews: (tag: ITagView) => void
  delAllViews: () => void
  setOperateTagsMethods: (methods: any) => void
}

class TagsView implements ITagsViewState {
  public visitedViews: ITagView[] = [];

  public defaultCachedViews: (string | undefined)[] = [];

  public cachedViews: (string | undefined)[] = [];

  public activeTag: ITagView = { meta: {} };

  public operateTagsMethods: any = {}

  private ADD_ACTIVE_TAGS(view: ITagView) {
    this.activeTag = view
  }

  private ADD_VISITED_VIEW(view: ITagView) {
    if (this.visitedViews.some(v => v.path === view.path)) return
    this.visitedViews.push(
      Object.assign({}, view, {
        meta: {
          ...view.meta,
          title: view.meta.title || 'no-name'
        }
      })
    )
  }

  private ADD_CACHED_VIEW(view: ITagView) {
    if (view.name === null) return
    if (this.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      this.cachedViews.push(view.name)
    }
  }

  private DEL_VISITED_VIEW(view: ITagView) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1)
        break
      }
    }
  }

  private DEL_CACHED_VIEW(view: ITagView) {
    if (view.name === null) return
    const index = this.cachedViews.indexOf(view.name)
    index > -1 && this.cachedViews.splice(index, 1)
  }

  private DEL_OTHERS_VISITED_VIEWS(view: ITagView) {
    this.visitedViews = this.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  }

  private DEL_OTHERS_CACHED_VIEWS(view: ITagView) {
    if (view.name === null) return
    const index = this.cachedViews.indexOf(view.name)
    if (index > -1) {
      this.cachedViews = this.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      this.cachedViews = []
    }
  }

  private DEL_ALL_VISITED_VIEWS() {
    // keep affix tags
    const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
    this.visitedViews = affixTags
  }

  private DEL_ALL_VIEWS() {
    this.visitedViews = []
  }

  private DEL_ALL_CACHED_VIEWS() {
    this.cachedViews = []
  }

  private UPDATE_VISITED_VIEW(view: ITagView) {
    for (let v of this.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }

  @action.bound
  public addView(view: ITagView) {
    this.ADD_ACTIVE_TAGS(view)
    this.ADD_VISITED_VIEW(view)
    this.ADD_CACHED_VIEW(view)
  }

  @action.bound
  public addVisitedView(view: ITagView) {
    this.ADD_ACTIVE_TAGS(view)
    this.ADD_VISITED_VIEW(view)
  }

  @action.bound
  public delView(view: ITagView) {
    this.DEL_VISITED_VIEW(view)
    this.DEL_CACHED_VIEW(view)
  }

  @action.bound
  public delCachedView(view: ITagView) {
    this.DEL_CACHED_VIEW(view)
  }

  @action.bound
  public delOthersViews(view: ITagView) {
    this.DEL_OTHERS_VISITED_VIEWS(view)
    this.DEL_OTHERS_CACHED_VIEWS(view)
  }

  @action.bound
  public delAllViews(delAffix = false) {
    // delAffix 是否删除 affix tag
    if (delAffix) {
      this.DEL_ALL_VIEWS()
    } else {
      this.DEL_ALL_VISITED_VIEWS()
    }
    this.DEL_ALL_CACHED_VIEWS()
  }

  @action.bound
  public delAllCachedViews() {
    this.DEL_ALL_CACHED_VIEWS()
  }

  @action.bound
  public updateVisitedView(view: ITagView) {
    this.ADD_ACTIVE_TAGS(view)
    this.UPDATE_VISITED_VIEW(view)
  }

  @action.bound
  public setOperateTagsMethods(methods: any) {
    Object.assign(this.operateTagsMethods, methods)
  }

  @action.bound
  public setDeaultCachedViews(tagName: string) {
    this.defaultCachedViews.push(tagName)
  }
}

const TagsViewModule = new TagsView()
export { TagsViewModule }
