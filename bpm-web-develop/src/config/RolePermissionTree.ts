// 角色权限树
import { PermissionEnum } from "@/config/PermissionEnum";

export default [
  {
    name: "流程管理",
    children: [
      {
        name: "流程定义",
        children: [
          { name: "查看", permission: PermissionEnum.bpmDefinitionView },
          { name: "新建", permission: PermissionEnum.bpmDefinitionCreate },
          { name: "编辑", permission: PermissionEnum.bpmDefinitionModify },
          { name: "启用", permission: PermissionEnum.bpmDefinitionEnable },
          { name: "停用", permission: PermissionEnum.bpmDefinitionDisable },
        ],
      },
      {
        name: "流程分组",
        children: [
          { name: "新建", permission: PermissionEnum.bpmGroupCreate },
          { name: "编辑", permission: PermissionEnum.bpmGroupModify },
          { name: "删除", permission: PermissionEnum.bpmGroupDelete },
        ],
      },
      {
        name: "流程实例",
        children: [
          { name: "查看", permission: PermissionEnum.bpmInstanceView },
          { name: "终止", permission: PermissionEnum.bpmInstanceCancel },
        ],
      },
    ],
  },
  {
    name: "系统管理",
    children: [
      {
        name: "用户管理",
        children: [{ name: "查看", permission: PermissionEnum.bpmUserView }],
      },
      {
        name: "角色管理",
        children: [
          { name: "查看", permission: PermissionEnum.bpmRoleView },
          { name: "新建", permission: PermissionEnum.bpmRoleCreate },
          { name: "编辑", permission: PermissionEnum.bpmRoleModify },
          { name: "删除", permission: PermissionEnum.bpmRoleDelete },
        ],
      },
      {
        name: "应用系统",
        children: [
          { name: "查看", permission: PermissionEnum.bpmAppSystemView },
          { name: "新建", permission: PermissionEnum.bpmAppSystemCreate },
          { name: "编辑", permission: PermissionEnum.bpmAppSystemModify },
          { name: "删除", permission: PermissionEnum.bpmAppSystemDelete },
        ],
      },
    ],
  },
];
