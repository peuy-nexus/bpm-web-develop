import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import BpmDefinitionApi from "@/http/bpm/BpmDefinitionApi";

@Component({
  name: "BpmStartButton",
})
export default class StartButton extends Vue {
  @Prop({ type: String, required: true }) moduleKey: string;
  @Prop({ type: String }) trigger: string;

  bpmDefinitions: any[] = [];

  @Watch("moduleKey", { immediate: true })
  moduleKeyChanged() {
    this.queryBpmDefinition();
  }

  queryBpmDefinition() {
    BpmDefinitionApi.query({
      filters: [
        { property: "startModule.uuid:=", value: this.moduleKey },
        { property: "state:=", value: "enabled" },
      ],
      page: 0,
      pageSize: 0,
    }).then(res => {
      this.bpmDefinitions = res.data.records;
    });
  }
}
