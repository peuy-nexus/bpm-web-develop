import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import StringUtil from "@/components/waltz-vue/utils/StringUtil";
import NavMenu from "@/views/main/cmp/NavMenu.vue";
import i18n, { loadedLangTypes, loadI18n } from "@/i18n";
import AppApi from "@/http/bpm/AppApi";

@Component({
  components: { NavMenu },
  filters: {
    btnColor: (value: any) => {
      if (value === 0) {
        return "primary";
      } else if (value === 1) {
        return "success";
      } else if (value === 2) {
        return "error";
      }
    },
  },
})
export default class MainFrame extends Vue {
  $refs: any;

  @State("user") user: any; // 登录后返回的信息
  @State("permission") permission: string[]; // 权限列表（单单权限信息）
  @State("tenant") tenant: any; // 租户
  @State("embed") embed: string;
  @Action("systemConfig") setSystemConfig: (systemConfig: any) => void;
  @Action("permissions") setPermissions: (permissions: string[]) => void;
  @Action("embed") setEmbed: (embed: any) => void;
  @Action("clear") clearSession: () => void;

  navCollapsed: boolean = false; // 是否水平收起折叠菜单栏

  mounted() {
    Promise.all([this.getPermissionList(), this.getSystemConfig()]);
  }

  getPermissionList() {
    return Promise.resolve();
  }

  getSystemConfig() {
    return AppApi.getSystemConfig().then((resp: any) => {
      this.setSystemConfig(resp.data);
    });
  }

  @Watch("$route", { immediate: true, deep: true })
  routeChanged(to: any) {
    this.setEmbed(to.query?.embed || "false");
    if (to.meta && to.meta.i18n) {
      to.meta.i18n.forEach((type: string) => {
        loadI18n(type);
      });
    }
  }

  handleUserCommand(e: any) {
    if (e === "logout") {
      this.$confirm(`确认要退出登录吗?`, "提示").then(() => {
        this.$router.push({ name: "login" });
        this.clearSession();
      });
    }
  }
}
