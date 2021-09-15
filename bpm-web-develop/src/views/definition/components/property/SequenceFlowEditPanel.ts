import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import i18n from "@/i18n";
import ResourceModuleApi from "@/http/bpm/ResourceModuleApi";

const defaultOutgoings: any = {
  approve: i18n.t("公共.操作/审核通过"),
  submit: i18n.t("公共.操作/提交"),
  reject: i18n.t("公共.操作/驳回"),
  return: i18n.t("公共.操作/退回发起人"),
};
@Component({
  name: "SequenceFlowEditPanel",
  filters: {
    outgoingName: (key: string) => {
      return defaultOutgoings[key];
    },
  },
})
export default class SequenceFlowEditPanel extends Vue {
  @Prop({ type: Object }) modeling: any;
  @Prop({ type: Object }) moddle: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) bpmnx: any;

  targetData: any = {};
  formData: any = {
    customAction: false,
    action: "",
  };
  sourceElement: any = {};
  bizActions: any[] = [];
  sourceTask: any = {
    outgoings: [],
  };

  get defaultOutgoingKeys() {
    return ["approve", "submit", "reject", "return"];
  }

  get sourceType() {
    return this.bpmnElement && this.bpmnElement.source && this.bpmnElement.source.type;
  }

  @Watch("bpmnElement", { immediate: true })
  bpmnElementChanged() {
    let targetData = this.bpmnx.process.sequenceFlows.find((item: any) => item.id === this.bpmnElement.id);
    if (!targetData) {
      targetData = {
        id: this.bpmnElement.id,
        sourceId: this.bpmnElement.source && this.bpmnElement.source.id,
        targetId: this.bpmnElement.target && this.bpmnElement.target.id,
      };
      this.bpmnx.process.sequenceFlows.push(targetData);
    }
    this.targetData = targetData;
    this.formData = Object.assign({}, targetData);

    this.sourceElement = (this.bpmnElement && this.bpmnElement.source) || {};
    if (this.sourceElement && this.sourceElement.type === "bpmn:UserTask") {
      this.sourceTask = this.bpmnx.process.userTasks.find((item: any) => item.id === this.sourceElement.id);

      if (this.sourceTask.formModule) {
        this.loadResourceModule(this.sourceTask.formModule.uuid);
      }
    }
  }

  loadResourceModule(uuid: string) {
    ResourceModuleApi.get({
      uuid,
      fetchParts: ["actions"],
    }).then(res => {
      if (res.data) {
        this.bizActions = res.data.actions || [];
      }
    });
  }

  handleOutgoingChanged(event: any) {
    const targetData: any = {
      action: event,
      condition: `\${_action == '${event}'}`,
    };
    if (!this.formData.customAction) {
      targetData.name = defaultOutgoings[event];
    }

    const outgoing = this.sourceTask.outgoings.find((item: any) => item.sequenceFlow === this.formData.id);
    if (outgoing) {
      outgoing.key = event;
      outgoing.name = targetData.name;
    }
    this.formData = Object.assign({}, this.formData, targetData);
    Object.assign(this.targetData, this.formData);

    const condition = this.moddle.create("bpmn:FormalExpression", { body: this.formData.condition });
    this.modeling.updateProperties(this.bpmnElement, { name: outgoing.name, conditionExpression: condition });
  }

  handleNameChange(event: string) {
    const outgoing = this.sourceTask.outgoings.find((item: any) => item.sequenceFlow === this.formData.id);
    if (!outgoing) {
      outgoing.name = event;
    }
    this.modeling.updateProperties(this.bpmnElement, { name: event });
  }

  handleCustomChanged(event: boolean) {
    this.formData.customAction = event;
  }

  handleBizActionChanged() {
    console.log("handleBizActionChange");
  }

  handleLineNoChanged() {
    console.log("handleLineNoChanged");
    Object.assign(this.targetData, this.formData);
    if (this.sourceTask && this.sourceTask.outgoings) {
      this.sourceTask.outgoings.sort((a: any, b: any) => {
        const o1 = this.bpmnx.process.sequenceFlows.find((item: any) => item.id === a.sequenceFlow);
        const o2 = this.bpmnx.process.sequenceFlows.find((item: any) => item.id === b.sequenceFlow);
        return o1.lineNo - o2.lineNo;
      });
    }
  }

  handleDefaultChange(event: boolean) {
    if (event && this.sourceTask) {
      this.bpmnx.process.sequenceFlows.forEach((item: any) => {
        if (item.sourceId === this.formData.sourceId) {
          item.asDefault = item.id === this.formData.id;
        }
      });
    }
  }
}
