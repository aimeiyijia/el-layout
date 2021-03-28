import { observable, computed, action } from 'mobx'

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
}
class App {
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
  private ToggleSideBar(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @action.bound
  private CloseSideBar(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @action.bound
  private ToggleDevice(device: DeviceType) {
    this.device = device
  }

  @action.bound
  private SetSize(size: string) {
    this.size = size
  }
}
const AppModule = new App()
export { AppModule }
