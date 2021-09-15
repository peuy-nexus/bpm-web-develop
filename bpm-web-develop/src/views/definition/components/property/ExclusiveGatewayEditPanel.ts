import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "ExclusiveGatewayEditPanel",
})
export default class ExclusiveGatewayEditPanel extends Vue {
  @Prop({ type: Object }) modeling: any;
  @Prop({ type: Object }) moddle: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) bpmnx: any;
}
