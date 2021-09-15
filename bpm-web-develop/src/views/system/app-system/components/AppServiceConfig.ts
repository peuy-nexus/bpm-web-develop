import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import BpmDesignApi from "@/http/bpm/BpmDesignApi";
import BpmDefinitionApi from "@/http/bpm/BpmDefinitionApi";
import PropertyEditPanel from "@/views/definition/components/PropertyEditPanel.vue";
import AppSystemApi from "@/http/bpm/AppSystemApi";

@Component({
  name: "AppServiceConfig",
})
export default class AppServiceConfig extends Vue {
  @Prop({ type: String }) title: string;
  @Prop({ type: Object }) value: any;
  @Prop({ type: String }) fieldProp: string;

  authTypes: any[] = [{ value: "basic", label: "Basic Auth" }];
  authParams: any;

  rules: any = {
    serverUrl: [
      {
        required: true,
        message: this.$t("流程中心.系统管理/应用系统/服务访问配置/服务地址/输入提示"),
        trigger: ["blur", "change"],
      },
    ],
    authType: [],
    "basic.username": [],
    "basic.password": [],
  };

  @Watch("value", { immediate: true })
  valueChanged() {
    this.authParams = JSON.parse((this.value && this.value.authParams) || "{}");
  }

  handleValueChanged(field: string, event: string) {
    this.$emit(
      "input",
      Object.assign({}, this.value, {
        [field]: event,
      }),
    );
  }

  handleAuthTypeChanged() {
    this.authParams = {};
    this.$emit(
      "input",
      Object.assign({}, this.value, {
        authParams: this.authParams,
      }),
    );
  }

  handleAuthParamsChanged() {
    this.$emit(
      "input",
      Object.assign({}, this.value, {
        authParams: JSON.stringify(this.authParams),
      }),
    );
  }
}
