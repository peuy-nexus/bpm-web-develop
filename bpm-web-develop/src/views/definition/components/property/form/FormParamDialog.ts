import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import BpmGroupSelect from "@/views/definition/components/BpmGroupSelect.vue";

@Component({
  name: "FormParamDialog",
  components: {
    BpmGroupSelect,
  },
})
export default class FormParamDialog extends Vue {
  @Prop({ type: Boolean }) visible: boolean;
  @Prop({ type: Object }) value: any;

  formData: any = {};
  rules: any = {
    name: [{ required: true, message: this.$t("流程中心.流程定义/页面参数/名称/输入提示"), trigger: ["blur"] }],
  };
  $refs: any;

  @Watch("value", { immediate: true })
  valueChanged() {
    this.formData = Object.assign({}, this.formData, this.value);
  }

  doConfirm() {
    this.$refs.form.validate((valid: boolean) => {
      if (!valid) {
        return;
      }
      this.controller.ok(this.formData);
    });
  }
}
