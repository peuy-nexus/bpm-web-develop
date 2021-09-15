/*
 * @Author: 徐庆凯
 * @Date: 2020-10-25 10:41:29
 * @LastEditTime: 2020-12-02 20:40:15
 * @LastEditors: 徐庆凯
 * @Description:路由
 * @FilePath: /sop-web/src/router/index.ts
 * @symbol_custom_string_obkoro1: 记得注释
 */
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import NProgress from "nprogress"; // 顶部进度条
import "nprogress/nprogress.css";
import menuRoutes from "@/router/menu-routers";
import i18n from "@/i18n";

NProgress.configure({ showSpinner: false }); // 禁用加载动画
Vue.use(VueRouter);

function getRoutes(routes: any[]) {
  const result: any[] = [];
  for (const route of routes) {
    if (route.children) {
      result.push(...getRoutes(route.children));
    } else if (route.path && route.component) {
      result.push(route);
    }
  }
  return result;
}

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "/",
    redirect: "/definition/view",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/Login.vue"),
    meta: {
      title: "登录.标题",
      keepAlive: true,
      i18n: ["登陆"],
    },
  },
  {
    path: "/mainFrame",
    name: "mainFrame",
    component: () => import("../views/main/MainFrame.vue"),
    redirect: {
      name: "Home",
    },
    children: getRoutes(menuRoutes),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to: any, from: any, next: any) => {
  console.log("routerChanged", to);
  if (to.meta.title) {
    (document as any).i18nTitle = to.meta.title;
    document.title = `${i18n.t(to.meta.title)} | hdbpm`;
  }
  NProgress.start();
  return next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
