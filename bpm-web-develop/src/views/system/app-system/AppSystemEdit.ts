import { Component, Vue } from "vue-property-decorator";
import BpmDesignApi from "@/http/bpm/BpmDesignApi";
import BpmDefinitionApi from "@/http/bpm/BpmDefinitionApi";
import AppSystemApi from "@/http/bpm/AppSystemApi";
import AppServiceConfig from "@/views/system/app-system/components/AppServiceConfig.vue";

@Component({
  name: "AppSystemEdit",
  components: {
    AppServiceConfig,
  },
})
export default class AppSystemEdit extends Vue {
  rules: any = {
    code: [
      {
        required: true,
        message: String(this.$t("流程中心.系统管理/应用系统/代码/输入提示")),
        trigger: ["blur"],
      },
    ],
    name: [
      {
        required: true,
        message: String(this.$t("流程中心.系统管理/应用系统/名称/输入提示")),
        trigger: ["blur"],
      },
    ],
  };
  entity: any = {
    bizProviderConfig: {},
    processNoticeConfig: {},
    resourceModuleConfig: {},
    name: "",
    code: "",
    remark: "",
    url: "",
  };

  mounted(): void {
    const { uuid }: any = this.$route.query;
    if (uuid) {
      AppSystemApi;
    }
  }

  doSave() {
    (this.$refs.form as any).validate((valid: boolean) => {
      if (!valid) {
        return;
      }
      AppSystemApi.create(this.entity)
        .then((res: any) => {
          console.log("res", res);
          // this.$router.push({ name: "AppSystemView", query: { uuid: res } }); // 0915
          this.$router.push({ name: "AppSystemList", query: { uuid: res } });
        })
        .catch(this.$error);
    });
  }
}
