// 具体功能权限
export enum PermissionEnum {
  // 流程管理
  bpmDefinitionView = "bpmDefinition.view",
  bpmDefinitionCreate = "bpmDefinition.create",
  bpmDefinitionModify = "bpmDefinition.modify",
  bpmDefinitionEnable = "bpmDefinition.enable",
  bpmDefinitionDisable = "bpmDefinition.disable",
  //流程实例
  bpmInstanceView = "bpmInstance.view",
  bpmInstanceCancel = "bpmInstance.cancel",
  bpmInstanceDelete = "bpmInstance.delete",
  bpmInstanceStart = "bpmInstance.start",

  // 流程分组
  bpmGroupCreate = "bpmGroup.create",
  bpmGroupModify = "bpmGroup.modify",
  bpmGroupDelete = "bpmGroup.delete",

  bpmUserView = "bpmUser.view",
  bpmRoleView = "bpmRole.view",
  bpmRoleCreate = "bpmRole.create",
  bpmRoleModify = "bpmRole.modify",
  bpmRoleDelete = "bpmRole.delete",

  bpmAppSystemView = "bpmAppSystem.view",
  bpmAppSystemCreate = "bpmAppSystem.create",
  bpmAppSystemModify = "bpmAppSystem.modify",
  bpmAppSystemDelete = "bpmAppSystem.delete",
}
