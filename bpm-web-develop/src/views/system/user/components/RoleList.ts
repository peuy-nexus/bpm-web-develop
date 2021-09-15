import ListPage from "@/components/list-view/ListPage";
import { Component, Ref } from "vue-property-decorator";
import RoleFilter from "@/views/system/user/components/RoleFilter.vue";
import RolePermissionTree from "@/config/RolePermissionTree";
import CreateRoleApi from "@/http/bpm/CreateRoleApi";
import RolePermissionCard from "@/views/system/user/components/RolePermissionCard.vue";
import SetRolePermissions from "@/http/bpm/SetRolePermissions";
import ConstantMgr from "@/mgr/ConstantMgr";
import RoleUser from "@/views/system/user/components/RoleUser.vue";
import UserSelectDialog from "@/components/identity/user/UserSelectDialog.vue";
import SetUsers from "@/http/bpm/SetUsers";

@Component({
  name: "RoleList",
  components: {
    RoleFilter: RoleFilter,
    RolePermissionCard: RolePermissionCard,
    RoleUser: RoleUser,
  },
})
export default class RoleList extends ListPage {
  activeName: string = "rolePermissions";
  // 权限列表
  processManagementData: any = {};
  dialogFormVisible: boolean = false;
  createRoleForm: any = {
    name: "",
    code: "",
  };
  // 拿到RoleFilter的uuid
  uuid: string = "";
  // RoleUser页面的用户选择器show
  UserSelectDialogShow: boolean = false;
  // 点击角色选中的用户
  selectUser: any = [];
  current: number = -1;
  // 新建角色表达验证
  rules: any = {
    name: [
      {
        required: true,
        message: String(this.$t("流程中心.系统管理/用户管理/角色管理/说明输入提示/角色名称提示")),
        trigger: "blur",
      },
    ],
  };
  // 初始化
  created() {
    // 深拷贝权限数组
    const permissionTree: any = JSON.parse(JSON.stringify(RolePermissionTree));
    const permission = this.mapperMissionTree(permissionTree);
    permission.forEach((item: any) => {
      item.expand = true;
    });
    this.processManagementData = permission;
  }
  // 点击tab切换
  handleTabsClick() {
    console.log(this.activeName);
    this.$refs.RefRoleFilter.getRolePermissions(this.uuid, this.current, this.activeName);
  }

  // 角色权限
  // 获取创建角色表单元素
  @Ref("createRoleRuleForm") RefF: any;
  // 遍历权限列表 添加checked选中权限,和半选false
  mapperMissionTree(data: any) {
    data.forEach((item: any) => {
      item.checked = false;
      if (item.children) {
        item.isIndeterminate = false;
        this.mapperMissionTree(item.children);
      }
    });
    return data;
  }
  // 新建角色按钮的显示
  doCreate() {
    this.dialogFormVisible = true;
  }
  // 生成随机code
  S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  guid() {
    return this.S4() + this.S4();
  }
  // 创建角色事件处理按钮
  creatrRole() {
    this.createRoleForm.code = this.guid();
    const loading = this.$loading(ConstantMgr.loadingOption);
    CreateRoleApi.query(this.createRoleForm)
      .then((resp: any) => {
        loading.close();
        this.$message({
          message: String(this.$t("流程中心.系统管理/用户管理/角色管理/角色新建提示")),
          type: "success",
        });
        this.$refs.RefRoleFilter.getRoleList();
      })
      .catch(error => {
        loading.close();
        this.$error(error);
      });
    this.dialogFormVisible = false;
    this.RefF.resetFields();
  }
  // 取消创建角色按钮
  cancelRole() {
    console.log(this.RefF.resetFields);
    this.RefF.resetFields();
    this.dialogFormVisible = false;
  }
  // 保存角色权限
  savePermissions() {
    const res = this.mappTree(this.processManagementData);
    const loading = this.$loading(ConstantMgr.loadingOption);
    SetRolePermissions.query({ roleId: this.uuid, permissionIds: res })
      .then((resp: any) => {
        loading.close();
        this.$message({
          message: String(this.$t("流程中心.系统管理/用户管理/角色管理/保存角色权限提示")),
          type: "success",
        });
      })
      .catch(error => {
        loading.close();
        this.$error(error);
      });
  }
  // 截取其中选中的权限
  mappTree(data: any) {
    const flag: any = [];
    data.forEach((item1: any) => {
      item1.children.forEach((item2: any) => {
        item2.children.forEach((val: any) => {
          if (val.checked === true) {
            flag.push(val.permission);
          }
        });
      });
    });
    return flag;
  }
  // 显示设置角色用户按钮
  setRoleUser() {
    this.$dialog.show(UserSelectDialog).then((res: any) => {
      const setUser: any = [];
      res.output.forEach((item: any) => {
        setUser.push(item.uuid);
      });
      const loading = this.$loading(ConstantMgr.loadingOption);
      SetUsers.query({ roleId: this.uuid, userIds: setUser })
        .then((resp: any) => {
          loading.close();
          this.$message({
            message: String(this.$t("流程中心.系统管理/用户管理/角色管理/设置用户角色提示")),
            type: "success",
          });
          this.RefsGetRole(this.uuid, this.current);
        })
        .catch(error => {
          loading.close();
          this.$error(error);
        });
    });
  }
  // 调用子组件方法。重新获取权限列表
  RefsGetRole(uuid: string, current: number) {
    this.$refs.RefRoleFilter.getRolePermissions(uuid, current, this.activeName);
  }
}
