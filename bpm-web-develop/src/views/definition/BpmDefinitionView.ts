import { Component, Vue } from "vue-property-decorator";
import BpmDefinitionApi from "@/http/bpm/BpmDefinitionApi";
import BpmInstanceApi from "@/http/bpm/BpmInstanceApi";
import PropertyViewPanel from "@/views/definition/components/PropertyViewPanel.vue";

@Component({
  name: "BpmDefinitionView",
  components: {
    PropertyViewPanel,
  },
})
export default class BpmDefinitionView extends Vue {
  entity: any = { design: { modelXml: "" } };

  bpmnModeler: any = null;
  bpmnElement: any = null;

  mounted(): void {
    this.doGet();
  }

  doGet() {
    const { uuid }: any = this.$route.query;
    if (uuid) {
      BpmDefinitionApi.get({
        uuid: uuid,
        fetchParts: ["design", "starters", "userTasks", "userTasks.candidates"],
      }).then(res => {
        this.entity = res.data;
        console.log(this.entity);
      });
    }
  }

  doBack() {
    this.$router.push({ name: "BpmDefinitionList", query: { keepSearch: "true" } });
  }

  doEdit() {
    this.$router.push({ name: "BpmDefinitionEdit", query: { uuid: this.entity.uuid } });
  }

  doStart() {
    BpmInstanceApi.start({ processDefinitionKey: this.entity.key }).then((res: any) => {
      console.log(res);
    });
  }

  handleSelectionChanged({ newSelection }: any) {
    this.bpmnElement = newSelection[0] || null;
  }
}
