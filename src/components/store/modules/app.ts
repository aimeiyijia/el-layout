import { observable, action } from 'mobx'

export enum DeviceType {
  Mobile,
  Pad,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    collapse: boolean
    withoutAnimation: boolean
  }
  ToggleSideBar(withoutAnimation: boolean): any
  OpenSideBar(withoutAnimation: boolean): any
  CloseSideBar(withoutAnimation: boolean): any
  ToggleCollapse(): any
  OpenCollapse(): any
  CloseCollapse(): any
  ToggleDevice(device: DeviceType): any
}
class App implements IAppState {
  public sidebar = {
    opened: true,
    collapse: false,
    withoutAnimation: false
  }

  public device = DeviceType.Desktop

  @action.bound
  public ToggleSideBar(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @action.bound
  public OpenSideBar(withoutAnimation: boolean) {
    this.sidebar.opened = true
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @action.bound
  public CloseSideBar(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @action.bound
  public ToggleCollapse() {
    this.sidebar.collapse = !this.sidebar.collapse
  }

  @action.bound
  public OpenCollapse() {
    this.sidebar.collapse = true
  }

  @action.bound
  public CloseCollapse() {
    this.sidebar.collapse = false
  }

  @action.bound
  public ToggleDevice(device: DeviceType) {
    this.device = device
  }
}
const AppModule = new App()
export { AppModule }
