import { Component, Prop, Vue, PropSync, Watch } from "vue-property-decorator";
import RoleApi from "@/http/bpm/RoleApi";
import EditRoleApi from "@/http/bpm/EditRoleApi";
import DeleteRoleApi from "@/http/bpm/DeletdRoleApi";
import GetRolePermissionsApi from "@/http/bpm/GetRolePermissionsApi";
import GetRoleUser from "@/http/bpm/GetRoleUser";
import ConstantMgr from "@/mgr/ConstantMgr";
import GetRole from "@/http/bpm/GetRoleApi";

@Component({
  name: "RoleFilter",
})
export default class RoleFilter extends Vue {
  @Prop({ type: String }) activeName: string;
  @PropSync("uuid", { type: String }) roleId: string;
  // 权限列表
  @PropSync("processData", { type: Array }) processManagementData: any;
  @PropSync("selectUser", { type: Array }) userData: any;
  @PropSync("currentNum", { type: Number }) current: number;
  roleCode: string = "";
  gettableData: any = [];
  editRoleForm: any = {
    name: "",
    uuid: "",
  };
  dialogFormVisible: boolean = false;
  // 修改角色表达验证
  rules: any = {
    name: [
      {
        required: true,
        message: String(this.$t("流程中心.系统管理/用户管理/角色管理/说明输入提示/角色名称提示")),
        trigger: "blur",
      },
    ],
  };
  created() {
    // 获取角色列表
    this.getRoleList()
      .then(() => {
        if (this.roleId === "" && this.gegettableData !== []) {
          this.roleId = this.gettableData[0].uuid;
          this.current = 0;
        }
      })
      .then(() => {
        this.getRolePermissions(this.roleId, this.current, this.activeName);
      });
  }

  // 获取角色列表
  getRoleList() {
    return new Promise((resolve: any, reject: any) => {
      const loading = this.$loading(ConstantMgr.loadingOption);
      RoleApi.query({ fetchParts: ["roles", "posts", "departments"] })
        .then((res: any) => {
          loading.close();
          this.gettableData = [];
          res.data.records.forEach((item: any) => {
            this.gettableData.push({ name: item.name, code: item.code, uuid: item.uuid });
          });
          resolve();
        })
        .catch((error: any) => {
          loading.close();
          this.$error(error);
        });
    });
  }
  // 修改角色
  editRole(role: any) {
    const loading = this.$loading(ConstantMgr.loadingOption);
    EditRoleApi.query(this.editRoleForm)
      .then((res: any) => {
        loading.close();
        this.$message({
          message: String(this.$t("流程中心.系统管理/用户管理/角色管理/角色修改提示")),
          type: "success",
        });
        this.getRoleList().then(() => {
          this.getRolePermissions(this.roleId, this.current, this.activeName);
        });
      })
      .catch((error: any) => {
        loading.close();
        this.$error(error);
      });
    this.dialogFormVisible = false;
  }
  // 删除角色
  deleteRole(uuid: number) {
    const loading = this.$loading(ConstantMgr.loadingOption);
    DeleteRoleApi.query({ uuid: uuid })
      .then((res: any) => {
        this.$message({
          message: String(this.$t("流程中心.系统管理/用户管理/角色管理/角色删除提示")),
          type: "success",
        });
        this.againRolePermissions();
      })
      .catch((error: any) => {
        loading.close();
        this.$error(error);
      });
  }
  // 点击修改展示对话框
  editRoleshow(role: any) {
    this.editRoleForm.name = role.name;
    this.editRoleForm.uuid = role.uuid;
    this.dialogFormVisible = true;
  }
  // 点击取消关闭对话框
  cancelRole() {
    this.dialogFormVisible = false;
  }
  // 获取角色权限或者角色用户
  getRolePermissions(uuid: string, index: number, activeName: string) {
    this.roleId = uuid;
    this.current = index;
    const loading = this.$loading(ConstantMgr.loadingOption);
    if (activeName === "rolePermissions") {
      GetRolePermissionsApi.query({ uuid: uuid })
        .then((res: any) => {
          loading.close();
          this.roleId = uuid;
          this.processManagementData = this.mapperMissionTree(this.processManagementData);
          this.processManagementData = this.mapperMission(this.processManagementData, res);
        })
        .catch((error: any) => {
          loading.close();
          this.$error(error);
        });
    } else if (activeName === "roleUser") {
      GetRoleUser.query({ uuid: uuid })
        .then((res: any) => {
          this.roleId = uuid;
          // 需要拿到用户列表
          this.userData = res.data;
          loading.close();
        })
        .catch((error: any) => {
          loading.close();
          this.$error(error);
        });
    }
  }
  // 遍历权限列表 添加为角色的权限修改checked为true
  mapperMission(data: any, res: any) {
    data.forEach((item: any) => {
      if (item.children) {
        this.mapperMission(item.children, res);
      }
      res.data.forEach((resIt: any) => {
        if (item.permission === resIt) {
          item.checked = true;
        }
      });
    });
    return data;
  }
  // 遍历权限列表 添加checked选中false权限
  mapperMissionTree(data: any) {
    data.forEach((item: any) => {
      item.checked = false;
      if (item.children) {
        this.mapperMissionTree(item.children);
      }
    });
    return data;
  }
  // 监听权限列表是否全部选中
  @Watch("processManagementData", { immediate: true, deep: true })
  onRolePowChanged(newVal: any, oldVal: any) {
    newVal.forEach((item: any) => {
      item.children.forEach((row: any) => {
        this.AlldataHald(row);
      });
      this.AlldataHald(item);
    });
  }
  AlldataHald(row: any) {
    const rowSome = row.children.some((item: any) => {
      return item.checked === true;
    });
    const rowEvery = row.children.every((item: any) => {
      return item.checked === true;
    });
    if (rowEvery) {
      row.checked = true;
      row.isIndeterminate = false;
    } else if (rowSome) {
      row.checked = false;
      row.isIndeterminate = true;
    } else {
      row.checked = false;
      row.isIndeterminate = false;
    }
  }
  // 根据角色代码/角色名称查询
  selectRole() {
    if (this.roleCode !== "") {
      new Promise((resolve: any, reject: any) => {
        this.gettableData = this.gettableData.filter((item: any) => {
          return item.name === this.roleCode || item.code === this.roleCode;
        });
        resolve();
      }).then(() => {
        if (this.gettableData !== []) {
          GetRole.query({ uuid: this.gettableData[0].uuid }).then((res: any) => {
            console.log(this.current);
            this.gettableData = [{ code: res.data.code, name: res.data.name, uuid: res.data.uuid }];
            this.getRolePermissions(res.data.uuid, this.current, this.activeName);
          });
        }
      });
    } else {
      this.againRolePermissions();
    }
  }
  // 当修改,删除,查询角色重新按角色获取权限
  againRolePermissions() {
    this.getRoleList().then(() => {
      this.getRolePermissions(this.gettableData[0].uuid, this.current, this.activeName);
      this.current = 0;
    });
  }
}
