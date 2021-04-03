import { observable, action } from 'mobx'
import { RouteConfig } from 'vue-router'
export interface IPermissionState {
  routes: RouteConfig[]
  GenerateRoutes(accessedRoutes: RouteConfig[]): void
}
class Permission implements IPermissionState {
  @observable
  public routes: RouteConfig[] = []

  @action.bound
  public GenerateRoutes(accessedRoutes: RouteConfig[]) {
    this.routes = accessedRoutes
  }
}

const PermissionModule = new Permission()
export { PermissionModule }
