import { observable, action } from 'mobx'
import { RouteConfig } from 'vue-router'

const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
  GenerateRoutes(accessedRoutes: RouteConfig[]): void
}
class Permission implements IPermissionState {
  @observable
  public routes: RouteConfig[] = []

  @observable
  public dynamicRoutes: RouteConfig[] = []

  @action.bound
  public GenerateRoutes(accessedRoutes: RouteConfig[]) {
    this.routes = accessedRoutes
    this.dynamicRoutes = accessedRoutes
  }
}

const PermissionModule = new Permission()
export { PermissionModule }
