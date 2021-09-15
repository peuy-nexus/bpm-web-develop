import { Component, Prop, Vue, PropSync, Watch, Emit } from "vue-property-decorator";
import ListPage from "@/components/list-view/ListPage";
import ConstantMgr from "@/mgr/ConstantMgr";
import UserApi from "@/http/bpm/UserApi";
import DelUserRoleApi from "@/http/bpm/DelUserRoleApi";
import UserSelectDialog from "@/components/identity/user/UserSelectDialog.vue";
import GetRoleUser from "@/http/bpm/GetRoleUser";

@Component({
  name: "RoleUser",
  components: {
    UserSelectDialog: UserSelectDialog,
  },
})
export default class RoleUser extends ListPage {
  @PropSync("selectUser", { type: Array }) userData: any;
  @PropSync("uuid", { type: String }) roleId: string;
  excludeList: any = [];
  // 角色用户

  // 删除用户的角色
  delRoleUser(row: any) {
    const loading = this.$loading(ConstantMgr.loadingOption);
    DelUserRoleApi.query({ roleId: this.roleId, userIds: [row] })
      .then((resp: any) => {
        loading.close();
        this.$message({
          message: String(this.$t("流程中心.系统管理/用户管理/角色管理/用户移出角色提示")),
          type: "success",
        });
        this.GetRoleUser();
      })
      .catch((error: any) => {
        loading.close();
        this.$error(error);
      });
  }
  GetRoleUser() {
    const loading = this.$loading(ConstantMgr.loadingOption);
    GetRoleUser.query({ uuid: this.roleId })
      .then((res: any) => {
        this.userData = res.data;
        loading.close();
      })
      .catch((error: any) => {
        loading.close();
        this.$error(error);
      });
  }
}
