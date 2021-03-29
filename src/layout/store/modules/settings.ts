import { observable, action } from 'mobx'
import defaultSettings from '@/layout/settings'

export interface ISettingsState {
  fixedHeader: boolean
  showTagsView: boolean
  showSidebarLogo: boolean
  showBreadcrumb: boolean

  sideBarWidth: string
  subMenuBgColor: string
  subMenuHoverColor: string
  subMenuActiveTextColor: string
  menuBgColor: string
  menuTextColor: string
  menuActiveTextColor: string
  tagActiveColor: string

  ChangeSetting(payload: { key: string, value: any}): void
}

class Settings implements ISettingsState {
  // 页面功能配置
  @observable
  public fixedHeader = defaultSettings.fixedHeader
  @observable
  public showTagsView = defaultSettings.showTagsView
  @observable
  public showSidebarLogo = defaultSettings.showSidebarLogo
  @observable
  public showBreadcrumb = defaultSettings.showBreadcrumb

  // 页面样式配置
  @observable
  public sideBarWidth = defaultSettings.sideBarWidth

  @observable
  public subMenuBgColor = defaultSettings.subMenuBgColor

  @observable
  public subMenuHoverColor = defaultSettings.subMenuHoverColor

  @observable
  public subMenuActiveTextColor = defaultSettings.subMenuActiveTextColor

  @observable
  public menuBgColor = defaultSettings.menuBgColor

  @observable
  public menuTextColor = defaultSettings.menuTextColor

  @observable
  public menuActiveTextColor = defaultSettings.menuActiveTextColor

  @observable
  public tagActiveColor = defaultSettings.tagActiveColor

  @action.bound
  public ChangeSetting(payload: { key: string, value: any}) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value
      document.body.style.setProperty(`--${key}`, value)
    }
  }
}
const SettingsModule = new Settings()
export { SettingsModule }
