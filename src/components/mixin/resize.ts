import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule, DeviceType, IAppState } from '@/components/store/modules/app'

// 小于800为手机宽度
const MOBILEWIDTHThRESHOLD = 800 // refer to Bootstrap's responsive design
// 大于800小于1200为pad宽度
const PADWIDTHThRESHOLD = 1200
// 大于1200则为桌面端
@Component({
  name: 'ResizeMixin'
})
export default class extends Vue {
  public AppModule: IAppState = AppModule
  private lastClientWidth = 0
  private lastClientHeight = 0
  get device() {
    return this.AppModule.device
  }

  get sidebar() {
    return this.AppModule.sidebar
  }

  //
  get isSideBarOpen() {
    return this.sidebar.opened
  }

  get isCollapse() {
    return this.sidebar.collapse
  }

  @Watch('$route')
  private onRouteChange() {
    if (this.device === DeviceType.Mobile && this.sidebar.opened) {
      this.AppModule.CloseSideBar(false)
    }
  }

  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  }

  mounted() {
    this.lastClientWidth = document.body.clientWidth
    this.lastClientHeight = document.body.clientHeight
    this.resizeHandler()
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  private isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width <= MOBILEWIDTHThRESHOLD
  }

  private isPad() {
    const rect = document.body.getBoundingClientRect()
    return rect.width > MOBILEWIDTHThRESHOLD && rect.width <= PADWIDTHThRESHOLD
  }

  private isDesktop() {
    const rect = document.body.getBoundingClientRect()
    return rect.width > PADWIDTHThRESHOLD
  }

  private isClientWidthChange() {
    const clientWidth = document.body.clientWidth
    if (clientWidth !== this.lastClientWidth) return true
    this.lastClientWidth = document.body.clientWidth
    return false
  }

  private isClientHeightChange() {
    const clientHeight = document.body.clientHeight
    if (clientHeight !== this.lastClientHeight) return true
    this.lastClientHeight = document.body.clientHeight
    return false
  }

  private resizeHandler() {
    if (!document.hidden) {
      let device = DeviceType.Desktop
      const isMobile = this.isMobile()

      const isPad = this.isPad()

      const isDesktop = this.isDesktop()

      const isClientHeightChange = this.isClientHeightChange()

      // 如果是手机端，侧边栏直接隐藏但菜单本身处于展开状态
      if (isMobile) {
        device = DeviceType.Mobile
        this.AppModule.CloseSideBar(true)
        this.AppModule.CloseCollapse()
      }
      // 如果是pad端，侧边栏显示但处于折叠状态
      // 是高度变更，就不去判断是否展开
      if (isPad && !isClientHeightChange) {
        device = DeviceType.Pad
        this.AppModule.OpenSideBar(true)
        this.AppModule.OpenCollapse()
      }
      // 如果是desktop端，侧边栏显示并处于展开状态
      if (isDesktop && !isClientHeightChange) {
        device = DeviceType.Desktop
        this.AppModule.OpenSideBar(true)
        this.AppModule.CloseCollapse()
      }

      // console.log(device, '123设备')
      this.AppModule.ToggleDevice(device)
    }
  }
}
