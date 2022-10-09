import { observable, action } from 'mobx'
import { RouteConfig } from 'vue-router'

const isNeedRenderMenu = (route: RouteConfig) => {
  if (route.meta && Object.prototype.hasOwnProperty.call(route.meta, 'isMenu')) {
    return route.meta.isMenu
  } else {
    return true
  }
}

const filterRoutes = (routes: RouteConfig[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    const rChild = r.children
    const isMenu = isNeedRenderMenu(r)
    if (isMenu) {
      res.push(r)
    } else {
      // 父路由不需要渲染成菜单，但是其子路由可能有需要渲染成菜单的
      if (rChild) {
        r.children = filterRoutes(rChild)
        res.push(...r.children)
      }
    }
    // console.log(r);
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  GenerateRoutes(accessedRoutes: RouteConfig[]): void
}
class Permission implements IPermissionState {
  @observable
  public routes: RouteConfig[] = []

  @action.bound
  public GenerateRoutes(accessedRoutes: RouteConfig[]) {
    this.routes = filterRoutes(accessedRoutes)
  }
}

const PermissionModule = new Permission()
export { PermissionModule }
