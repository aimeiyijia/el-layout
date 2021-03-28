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
  size: string
  ToggleSideBar(withoutAnimation: boolean): any
  CloseSideBar(withoutAnimation: boolean): any
  ToggleDevice(device: DeviceType): any
  SetSize(size: string): any
}
class App implements IAppState {
  @observable
  public sidebar = {
    opened: true,
    withoutAnimation: false
  }

  @observable
  public device = DeviceType.Desktop

  @observable
  public size = 'medium'

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

  @action.bound
  public SetSize(size: string) {
    this.size = size
  }
}
const AppModule = new App()
export { AppModule }
