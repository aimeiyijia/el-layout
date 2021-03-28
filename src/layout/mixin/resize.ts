import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule, DeviceType, IAppState } from '@/layout/store/modules/app'

const WIDTH = 992 // refer to Bootstrap's responsive design

@Component({
  name: 'ResizeMixin'
})
export default class extends Vue {

  private AppModule: IAppState = AppModule
  get device() {
    return this.AppModule.device
  }

  get sidebar() {
    return this.AppModule.sidebar
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
    const isMobile = this.isMobile()
    if (isMobile) {
      this.AppModule.ToggleDevice(DeviceType.Mobile)
      this.AppModule.CloseSideBar(true)
    }
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  private isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  private resizeHandler() {
    if (!document.hidden) {
      const isMobile = this.isMobile()
      this.AppModule.ToggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop)
      if (isMobile) {
        this.AppModule.CloseSideBar(true)
      }
    }
  }
}
