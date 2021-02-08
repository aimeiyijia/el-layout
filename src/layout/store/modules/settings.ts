import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/layout/store'
import defaultSettings from '@/layout/settings'

export interface ISettingsState {
  fixedHeader: boolean
  showTagsView: boolean
  showSidebarLogo: boolean
}

@Module({ dynamic: true, store, name: 'settings' })
class Settings extends VuexModule implements ISettingsState {
  // 页面功能配置
  public fixedHeader = defaultSettings.fixedHeader
  public showTagsView = defaultSettings.showTagsView
  public showSidebarLogo = defaultSettings.showSidebarLogo

  // 页面样式配置
  public sideBarWidth = defaultSettings.sideBarWidth
  public subMenuBgColor = defaultSettings.subMenuBgColor
  public subMenuHoverColor = defaultSettings.subMenuHoverColor
  public subMenuActiveTextColor = defaultSettings.subMenuActiveTextColor
  public menuBgColor = defaultSettings.menuBgColor
  public menuTextColor = defaultSettings.menuTextColor
  public menuActiveTextColor = defaultSettings.menuActiveTextColor


  @Mutation
  private CHANGE_SETTING(payload: { key: string, value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value
      document.body.style.setProperty(`--${key}`, value)
    }
  }

  @Action
  public ChangeSetting(payload: { key: string, value: any}) {
    this.CHANGE_SETTING(payload)
  }
}

export const SettingsModule = getModule(Settings)
