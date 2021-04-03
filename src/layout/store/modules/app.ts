import { observable, action } from 'mobx'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  ToggleSideBar(withoutAnimation: boolean): any
  CloseSideBar(withoutAnimation: boolean): any
  ToggleDevice(device: DeviceType): any
}
class App implements IAppState {
  public sidebar = {
    opened: true,
    withoutAnimation: false
  }

  public device = DeviceType.Desktop

  @action.bound
  public ToggleSideBar(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @action.bound
  public CloseSideBar(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @action.bound
  public ToggleDevice(device: DeviceType) {
    this.device = device
  }
}
const AppModule = new App()
export { AppModule }
