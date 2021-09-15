import { PermissionEnum } from "@/config/PermissionEnum";

/** 菜单的路由*/
const menuRoutes: any[] = [
  {
    path: "/homepage",
    name: "Home",
    meta: { title: "流程中心.首页/标题", i18n: ["首页"], menu: true },
    component: () => import("../views/homepage/HomePage.vue"),
  },
  {
    path: "/unauthorized",
    name: "Unauthorized",
    meta: { title: "通用.未授权", i18n: ["公共"] },
    component: () => import("../views/unauthorize/unauthorize.vue"),
  },
  {
    path: "/notfound",
    name: "NotFound",
    meta: { title: "公共.页面不存在", i18n: ["公共", "流程中心"] },
    component: () => import("../views/not-found/NotFound.vue"),
  },
  {
    path: "/todo",
    name: "TodoTaskList",
    meta: {
      title: "流程中心.流程待办/标题",
      i18n: ["流程中心", "公共"],
      menu: true,
    },
    component: () => import("../views/my-todo/TodoTaskList.vue"),
  },
  {
    path: "/started",
    name: "StartedTaskList",
    meta: {
      title: "流程中心.我发起的/标题",
      i18n: ["流程中心", "公共"],
      menu: true,
    },
    component: () => import("../views/my-started/StartedTaskList.vue"),
  },
  {
    path: "/joined",
    name: "JoinedTaskList",
    meta: {
      title: "流程中心.我参与的/标题",
      i18n: ["流程中心", "公共"],
      menu: true,
    },
    component: () => import("../views/my-joined/JoinedTaskList.vue"),
  },
  {
    path: "/instance",
    name: "BpmInstanceList",
    meta: {
      title: "流程中心.流程实例/标题",
      permission: PermissionEnum.bpmInstanceView,
      i18n: ["流程中心", "公共"],
      menu: true,
    },
    component: () => import("../views/instance/BpmInstanceList.vue"),
  },
  {
    path: "/definition",
    name: "BpmDefinitionList",
    meta: {
      title: "流程中心.流程定义/标题",
      permission: PermissionEnum.bpmDefinitionView,
      i18n: ["流程中心", "公共"],
      menu: true,
    },
    component: () => import("../views/definition/BpmDefinitionList.vue"),
  },
  {
    path: "/definition/view",
    name: "BpmDefinitionView",
    meta: {
      title: "流程中心.流程定义/标题",
      parent: "BpmDefinitionList",
      permission: PermissionEnum.bpmDefinitionView,
      i18n: ["流程中心", "公共"],
    },
    component: () => import("../views/definition/BpmDefinitionView.vue"),
  },
  {
    path: "/definition/edit",
    name: "BpmDefinitionEdit",
    meta: {
      title: "流程中心.流程设计/标题",
      parent: "BpmDefinitionList",
      i18n: ["流程中心", "公共"],
    },
    component: () => import("../views/definition/BpmDefinitionEdit.vue"),
  },
  {
    path: "/system",
    name: "System",
    meta: {
      title: "流程中心.系统管理/标题",
      i18n: ["流程中心", "公共"],
      menu: true,
    },
    children: [
      {
        path: "/users",
        name: "UserMgr",
        meta: {
          title: "流程中心.系统管理/用户管理/标题",
          i18n: ["流程中心", "公共"],
          permission: PermissionEnum.bpmUserView,
          menu: true,
        },
        component: () => import("../views/system/user/UserMgr.vue"),
      },
      {
        path: "/app-system",
        name: "AppSystemList",
        meta: {
          title: "流程中心.系统管理/应用系统/标题",
          i18n: ["流程中心", "公共"],
          permission: PermissionEnum.bpmAppSystemView,
          menu: true,
        },
        component: () => import("../views/system/app-system/AppSystemList.vue"),
      },
      {
        path: "/app-system/edit",
        name: "AppSystemEdit",
        meta: {
          title: "流程中心.系统管理/应用系统/标题",
          parent: "AppSystemList",
          permission: PermissionEnum.bpmAppSystemView,
          i18n: ["流程中心", "公共"],
        },
        component: () => import("../views/system/app-system/AppSystemEdit.vue"),
      },
    ],
  },
];

export default menuRoutes;
