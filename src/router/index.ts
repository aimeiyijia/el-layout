import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const arr = []
for (let i = 0; i < 20; i++) {
  arr.push({
    path: 'directive0' + i,
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    name: 'DirectivePermission0' + i,
    meta: {
      title: '测试子菜单0' + i,
      roles: ['admin']
    }
  })
}

export const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/permission',
    component: () => import(/* webpackChunkName: "login" */ '@/layout/index.vue'),
    redirect: '/permission/page',
    meta: {
      title: '测试父菜单',
      icon: 'lock',
      roles: ['admin', 'editor'], // you can set roles in root nav
      alwaysShow: true // will always show the root menu
    },
    children: [
      {
        path: 'page',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
        name: 'PagePermission',
        meta: {
          affix: true,
          activeMenu: '/permission/page',
          title: '测试子菜单1',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      ...arr
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = []

const createRouter = () => new VueRouter({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
