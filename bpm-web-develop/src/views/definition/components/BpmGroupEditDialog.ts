import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import BpmGroupApi from "@/http/bpm/BpmGroupApi";
import ConstantMgr from "@/mgr/ConstantMgr";
import BpmGroupSelect from "@/views/definition/components/BpmGroupSelect.vue";

@Component({
  name: "BpmGroupTree",
  components: {
    BpmGroupSelect,
  },
})
export default class BpmGroupTree extends Vue {
  @Prop({ type: Boolean }) visible: boolean;
  @Prop({ type: Object }) value: any;
  @Prop({ type: Object }) upper: any;

  formData: any = {
    orgId: "-",
  };
  rules: any = {
    name: [{ required: true, message: this.$t("流程中心.流程分组/名称/输入提示"), trigger: ["blur"] }],
  };
  $refs: any;

  @Watch("value", { immediate: true })
  valueChanged() {
    this.formData = Object.assign({}, this.formData, this.value);
  }

  @Watch("upper", { immediate: true })
  parentChanged() {
    this.formData = Object.assign({}, this.formData, {
      upper: this.upper,
    });
  }

  doSave() {
    this.$refs.form.validate((valid: boolean) => {
      if (!valid) {
        return;
      }
      const loading = this.$loading(ConstantMgr.loadingOption);
      BpmGroupApi[this.formData.uuid ? "modify" : "create"](this.formData)
        .then(() => {
          loading.close();
          this.controller.ok();
        })
        .catch((error: any) => {
          loading.close();
          this.$error(error);
        });
    });
  }
}
