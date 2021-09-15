import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import i18n from "@/i18n";
import identityTypeMap from "@/components/identity/IdentityTypeMap";
import IdentityPickDialog from "@/components/identity/IdentityPickDialog.vue";
import BpmDefinitionApi from "@/http/bpm/BpmDefinitionApi";

@Component({
  name: "UserTaskPanelViewPanel",
  filters: {
    identityType: (value: string) => {
      return i18n.t(identityTypeMap.get(value)) || "--";
    },
    outgoings: (value: any[]) => {
      return value && value.map(item => item.name).join(",");
    },
    formModule: (value: any) => {
      return value && `${value.name}[${value.code}]`;
    },
    formPage: (value: any) => {
      return (value && `${value.name || "--"}`) || "--";
    },
  },
})
export default class UserTaskPanelViewPanel extends Vue {
  @Prop({ type: Object }) modeling: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) bpmnx: any;
  @Prop({ type: Object }) entity: any;

  $refs: any;
  formData: any = {
    id: "",
    name: "",
    outVariable: "_action",
    formModule: {},
    formPage: {},
    formParams: [],
    outgoings: [],
  };

  @Watch("bpmnElement", { immediate: true })
  bpmnElementChanged() {
    this.formData = Object.assign(
      {},
      this.entity.userTasks.find((item: any) => item.key === this.bpmnElement.id),
      this.bpmnx.process.userTasks.find((item: any) => item.id === this.bpmnElement.id),
    );
  }

  doAddCandidates() {
    const candidates = this.formData.candidates || [];
    this.$dialog
      .show(IdentityPickDialog, {
        onSave: (list: any) => {
          const list2 = list.filter(
            (item: any) =>
              !candidates.find(
                (candidate: any) => candidate.identityType === item.identityType && candidate.uuid === item.uuid,
              ),
          );
          const newList = [...candidates, ...list2];
          return BpmDefinitionApi.setUserTaskCandidates({
            uuid: this.entity.uuid,
            taskDefinitionKey: this.formData.id,
            candidates: newList,
          }).then(() => {
            return newList;
          });
        },
      })
      .then((res: any) => {
        if (!res.wasCancelled) {
          this.formData.candidates = res.output;
          Object.assign(
            this.entity.userTasks.find((item: any) => item.key === this.bpmnElement.id),
            {
              candidates: this.formData.candidates,
            },
          );
        }
      })
      .catch((error: any) => {
        this.$error(error);
      });
  }

  doDeleteCandidate(index: any) {
    console.log("doDeleteCandidate", index);
    const newList = [...this.formData.candidates];
    newList.splice(index, 1);

    return BpmDefinitionApi.setUserTaskCandidates({
      uuid: this.entity.uuid,
      taskDefinitionKey: this.formData.id,
      candidates: newList,
    }).then(() => {
      this.formData.candidates = newList;
      Object.assign(
        this.entity.userTasks.find((item: any) => item.key === this.bpmnElement.id),
        {
          candidates: this.formData.candidates,
        },
      );
    });
  }
}
