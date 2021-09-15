import store from "../store";

export default class PermissionMgr {
  /**
   * 操作权限
   * @param permission
   * 使用示例：v-if="hasPermission('optTodo.edit')"
   */
  static hasPermission(permission: string) {
    const permissions = store.state.permissions;
    // TODO
    return true;
    // if (!storePermissionList || storePermissionList.length === 0) {
    //   return false;
    // }
    // const storePermission = storePermissionList.find((item: string) => {
    //   return item === permission;
    // });
    // return !!storePermission;
  }
}
