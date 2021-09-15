import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import BpmGroupApi from "@/http/bpm/BpmGroupApi";
import ConstantMgr from "@/mgr/ConstantMgr";

@Component({
  name: "BpmGroupTree",
})
export default class BpmGroupTree extends Vue {
  @Prop({ type: Boolean }) visible: boolean;
  @Prop({ type: Object }) value: any;

  formData: any = {};
  $refs: any;

  @Watch("value", { immediate: true })
  valueChanged() {
    this.formData = Object.assign({}, this.value, {
      upperUuid: this.value && this.value.upper && this.value.upper.uuid,
    });
    this.rules = {
      upper: [{ required: true }],
      name: [{ required: true }],
    };
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
