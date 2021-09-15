import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ResourceModuleApi from "@/http/bpm/ResourceModuleApi";
import FormParamDialog from "@/views/definition/components/property/form/FormParamDialog.vue";

@Component({
  name: "StartEventViewPanel",
  filters: {
    formModule: (value: any) => {
      return value && `${value.name}[${value.code}]`;
    },
    formPage: (value: any) => {
      return value && `${value.name}`;
    },
  },
})
export default class StartEventViewPanel extends Vue {
  @Prop({ type: Object }) modeling: any;
  @Prop({ type: Object }) moddle: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) bpmnx: any;

  $refs: any;
  formData: any = {
    formModule: null,
    formPage: null,
    formParams: [],
  };

  @Watch("bpmnElement", { immediate: true })
  bpmnElementChanged() {
    if (!this.bpmnx.process.startEvent) {
      this.bpmnx.process.startEvent = {
        id: this.bpmnElement.id,
        formModule: null,
        formPage: null,
        formParams: [],
      };
    }
    this.formData = this.bpmnx.process.startEvent;
  }
}
