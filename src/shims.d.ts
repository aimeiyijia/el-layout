import Vue from 'vue'
declare module '*.vue' {

  export default Vue
}

/** ElementUI component common definition */
declare class ElementUIComponent extends Vue {
  /** Install component into Vue */
  static install (vue: typeof Vue): void
}

interface ElScrollbarUpdate {
  ():void
}

declare class ElScrollbar extends ElementUIComponent {
  native: boolean
  wrapStyle: any
  wrapClass: any
  viewClass: any
  viewStyle: any
  noresize: boolean
  tag: string
  update: ElScrollbarUpdate
}

declare module 'element-ui/types' {
  interface Scrollbar extends ElScrollbar {}
  export class Scrollbar extends ElScrollbar {}
}

declare module 'element-ui/lib/locale/lang/*' {
  export const elementLocale: any
}

declare module '*.gif' {
  export const gif: any
}
