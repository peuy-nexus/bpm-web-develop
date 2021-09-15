import { Component, Prop, Vue } from "vue-property-decorator";
import BpmGroupSelect from "@/views/definition/components/BpmGroupSelect.vue";
import ConstantMgr from "@/mgr/ConstantMgr";
import BpmDefinitionApi from "@/http/bpm/BpmDefinitionApi";
import ResourceModuleDialog from "@/components/resource-module/ResourceModuleDialog.vue";

@Component({
  name: "BpmDefinitionEditDialog",
  components: {
    BpmGroupSelect,
  },
  filters: {
    startModule: (value: any) => {
      return value && value.name;
    },
  },
})
export default class BpmDefinitionEditDialog extends Vue {
  @Prop({ type: Boolean }) visible: boolean;
  @Prop({ type: Object }) value: any;
  @Prop({ type: Object }) upper: any;

  formData: any = {};
  rules: any = {
    name: [{ required: true, message: this.$t("流程中心.流程定义/流程名称/输入提示"), trigger: ["blur"] }],
    group: [{ required: true, message: this.$t("流程中心.流程定义/流程分组/输入提示"), trigger: ["blur"] }],
    startModule: [{ required: true, message: this.$t("流程中心.流程定义/发起模块/输入提示"), trigger: ["blur"] }],
  };
  $refs: any;

  mounted(): void {
    if (this.value && this.value.uuid) {
      this.formData = Object.assign({}, this.value);
    }
  }

  doSelectStartModule() {
    this.$dialog
      .show(ResourceModuleDialog, {
        value: this.formData.startModule,
      })
      .then((res: any) => {
        console.log(res);
        if (!res.wasCancelled) {
          Object.assign(this.formData, {
            startModule: res.data,
          });
        }
      });
  }

  doSave() {
    this.$refs.form.validate((valid: boolean) => {
      if (!valid) {
        return;
      }
      const loading = this.$loading(ConstantMgr.loadingOption);
      BpmDefinitionApi[this.formData.uuid ? "update" : "create"](this.formData)
        .then(res => {
          loading.close();
          this.controller.ok(res);
        })
        .catch((error: any) => {
          loading.close();
          this.$error(error);
        });
    });
  }
}
