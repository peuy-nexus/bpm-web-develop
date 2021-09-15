import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import IdentityPickDialog from "@/components/identity/IdentityPickDialog.vue";
import BpmDefinitionApi from "@/http/bpm/BpmDefinitionApi";
import BpmDefinitionEditDialog from "@/views/definition/components/BpmDefinitionEditDialog.vue";
import i18n from "@/i18n";
import stateMap from "@/views/definition/BpmDefinitionStateMap";
import identityTypeMap from "@/components/identity/IdentityTypeMap";

@Component({
  name: "ProcessViewPanel",
  filters: {
    state: (value: any) => {
      return i18n.t(stateMap.get(value)) || "--";
    },
    identityType: (value: string) => {
      return i18n.t(identityTypeMap.get(value)) || "--";
    },
  },
})
export default class ProcessViewPanel extends Vue {
  @Prop({ type: Object }) modeling: any;
  @Prop({ type: Object }) bpmnElement: any;
  @Prop({ type: Object }) bpmnx: any;
  @Prop({ type: Object }) entity: any;

  formData: any = {};

  doModify() {
    this.$dialog
      .show(BpmDefinitionEditDialog, {
        value: this.entity,
      })
      .then(() => {
        this.$emit("entity-change");
      });
  }

  doChangeState() {
    BpmDefinitionApi[this.entity.state === "disabled" ? "enable" : "disable"]({
      uuid: this.entity.uuid,
    })
      .then(() => {
        this.$emit("entity-change");
      })
      .catch(this.$error);
  }

  doAddStarters() {
    const starters = this.entity.starters || [];
    this.$dialog
      .show(IdentityPickDialog, {
        onSave: (list: any) => {
          const list2 = list.filter(
            (item: any) =>
              !starters.find(
                (starter: any) => starter.identityType === item.identityType && starter.uuid === item.uuid,
              ),
          );
          const newList = [...starters, ...list2];
          return BpmDefinitionApi.setProcessStarters({
            processDefinitionKey: this.entity.key,
            starters: newList,
          }).then(() => {
            return newList;
          });
        },
      })
      .then((res: any) => {
        if (!res.wasCancelled) {
          this.entity.starters = res.output;
        }
      });
  }

  doDeleteStarter(index: any) {
    const newList = [...this.entity.starters];
    newList.splice(index, 1);

    return BpmDefinitionApi.setProcessStarters({
      processDefinitionKey: this.entity.key,
      starters: newList,
    }).then(() => {
      this.entity.starters = newList;
    });
  }
}
