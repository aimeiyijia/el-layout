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
  public fixedHeader = defaultSettings.fixedHeader

  public showTagsView = defaultSettings.showTagsView

  public showSidebarLogo = defaultSettings.showSidebarLogo

  public showBreadcrumb = defaultSettings.showBreadcrumb

  // 页面样式配置
  public sideBarWidth = defaultSettings.sideBarWidth

  public subMenuBgColor = defaultSettings.subMenuBgColor

  public subMenuHoverColor = defaultSettings.subMenuHoverColor

  public subMenuActiveTextColor = defaultSettings.subMenuActiveTextColor

  public menuBgColor = defaultSettings.menuBgColor

  public menuTextColor = defaultSettings.menuTextColor

  public menuActiveTextColor = defaultSettings.menuActiveTextColor

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
