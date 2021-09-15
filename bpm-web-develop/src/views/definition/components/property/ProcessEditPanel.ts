import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "ProcessEditPanel",
})
export default class ProcessEditPanel extends Vue {
  @Prop({ type: Object }) modeling: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) bpmnx: any;

  formData: any = {};

  @Watch("bpmnx", { immediate: true })
  bpmnxChanged() {
    this.formData = Object.assign({}, this.bpmnx && this.bpmnx.process);
    console.log("bpmnxChanged", this.formData);
  }

  handleChange() {
    // this.modeling.updateProperties(this.bpmnElement, this.formData);
    this.$emit("change", Object.assign({}, this.bpmnx, { process: this.formData }));
  }
}
