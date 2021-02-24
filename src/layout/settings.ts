export interface ISettings {
  showTagsView: boolean
  showSidebarLogo: boolean
  fixedHeader: boolean
  showBreadcrumb: boolean
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
  showSidebarLogo: false,
  showBreadcrumb: false
}

// 页面样式配置
const stycfg: IStyCfg = {
  sideBarWidth: '210px',
  subMenuBgColor: '#1f2d3d',
  subMenuHoverColor: '#001528',
  subMenuActiveTextColor: '#f4f4f5',
  menuBgColor: '#304156',
  menuTextColor: '#bfcbd9',
  menuActiveTextColor: '#409EFF',
  tagActiveColor: '#42b984'
}

const defaultSettings = Object.assign(settings, stycfg)

export default defaultSettings
