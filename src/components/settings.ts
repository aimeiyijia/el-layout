export interface ISettings {
  showTagsView: boolean
  showSidebarLogo: boolean
  fixedHeader: boolean
  showBreadcrumb: boolean
  tagsViewMaxNum: number
}
export interface IStyCfg {
  sideBarWidth: string
  subMenuBgColor: string
  subMenuHoverColor: string
  subMenuActiveTextColor: string
  menuBgColor: string
  menuTextColor: string
  menuActiveTextColor: string
  tagActiveColor: string
}

// 页面功能配置
const settings: ISettings = {
  showTagsView: true,
  fixedHeader: false,
  showSidebarLogo: true,
  showBreadcrumb: false,
  tagsViewMaxNum: 10
}

// 页面样式配置
const stycfg: IStyCfg = {
  sideBarWidth: '250px',
  subMenuBgColor: '#455cc7',
  subMenuHoverColor: '#6174d0',
  subMenuActiveTextColor: '#c4c6ec',
  menuBgColor: '#455cc7',
  menuTextColor: '#c4c6ec',
  menuActiveTextColor: '#ffffff',
  tagActiveColor: '#1ABC9C'
}

const defaultSettings = Object.assign(settings, stycfg)

export default defaultSettings
