import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ProcessViewPanel from "./property/ProcessViewPanel.vue";
import EndEventViewPanel from "./property/EndEventViewPanel.vue";
import StartEventViewPanel from "./property/StartEventViewPanel.vue";
import SequenceFlowViewPanel from "./property/SequenceFlowViewPanel.vue";
import UserTaskPanelViewPanel from "./property/UserTaskPanelViewPanel.vue";
import ExclusiveGatewayViewPanel from "./property/ExclusiveGatewayViewPanel.vue";

@Component({
  name: "PropertyEditPanel",
  components: {
    ProcessViewPanel,
    bpmnStartEvent: StartEventViewPanel,
    bpmnEndEvent: EndEventViewPanel,
    bpmnUserTask: UserTaskPanelViewPanel,
    bpmnSequenceFlow: SequenceFlowViewPanel,
    bpmnExclusiveGateway: ExclusiveGatewayViewPanel,
  },
})
export default class PropertyEditPanel extends Vue {
  @Prop({ type: Object }) bpmnModeler: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) value: any;
  @Prop({ type: Object }) entity: any;

  modeling: any;

  get componentName() {
    const name = (this.bpmnElement && this.bpmnElement.type) || "ProcessViewPanel";
    return name.replaceAll(":", "");
  }

  @Watch("bpmnModeler", { immediate: true })
  bpmnModelerChanged() {
    this.modeling = this.bpmnModeler && this.bpmnModeler.get("modeling");
    this.moddle = this.bpmnModeler && this.bpmnModeler.get("moddle");

    if (this.bpmnModeler) {
      const elementRegistry: any = this.bpmnModeler.get("elementRegistry");
      console.log(elementRegistry.get(null));
    }
  }
}
