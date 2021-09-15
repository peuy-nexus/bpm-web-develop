import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "EndEventEditPanel",
})
export default class EndEventEditPanel extends Vue {
  @Prop({ type: Object }) modeling: any;
  @Prop({ type: Object }) moddle: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) bpmnx: any;

  formData: any = {};
}
