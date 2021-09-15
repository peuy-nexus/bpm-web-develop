import { Component, Vue, PropSync } from "vue-property-decorator";
import UserList from "@/views/system/user/components/UserList.vue";
import UrlUtil from "@/components/waltz-vue/utils/url-utils";
import RoleList from "@/views/system/user/components/RoleList.vue";

@Component({
  name: "UserMgr",
  components: {
    UserList: UserList,
    RoleList: RoleList,
  },
})
export default class UserMgr extends Vue {
  tabs = [
    { name: "UserList", label: "用户管理" },
    { name: "RoleList", label: "角色管理" },
  ];
  currentTab: any = "";

  mounted(): void {
    this.currentTab = UrlUtil.getParam("current") || "UserList";
  }

  doCreateRole() {
    console.log("doCreateRole");
  }

  handleTabClick(tab: any) {
    UrlUtil.setParamNoRefresh("current", tab.name);
  }
}
