import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "SequenceFlowEditPanel",
})
export default class SequenceFlowEditPanel extends Vue {
  @Prop({ type: Object }) modeling: any;
  @Prop({ type: Object }) moddle: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) bpmnx: any;

  formData: any = {};

  @Watch("bpmnElement", { immediate: true })
  bpmnElementChanged() {
    const targetData = this.bpmnx.process.sequenceFlows.find((item: any) => item.id === this.bpmnElement.id);
    this.formData = Object.assign({}, targetData);
  }
}
