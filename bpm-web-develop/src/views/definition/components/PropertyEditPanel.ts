import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ProcessEditPanel from "./property/ProcessEditPanel.vue";
import EndEventEditPanel from "./property/EndEventEditPanel.vue";
import StartEventEditPanel from "./property/StartEventEditPanel.vue";
import SequenceFlowEditPanel from "./property/SequenceFlowEditPanel.vue";
import UserTaskPanelEditPanel from "./property/UserTaskPanelEditPanel.vue";
import ExclusiveGatewayEditPanel from "./property/ExclusiveGatewayEditPanel.vue";

@Component({
  name: "PropertyEditPanel",
  components: {
    ProcessEditPanel,
    bpmnStartEvent: StartEventEditPanel,
    bpmnEndEvent: EndEventEditPanel,
    bpmnUserTask: UserTaskPanelEditPanel,
    bpmnSequenceFlow: SequenceFlowEditPanel,
    bpmnExclusiveGateway: ExclusiveGatewayEditPanel,
  },
})
export default class PropertyEditPanel extends Vue {
  @Prop({ type: Object }) bpmnModeler: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) value: any;

  modeling: any;

  get componentName() {
    const name = (this.bpmnElement && this.bpmnElement.type) || "ProcessEditPanel";
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
