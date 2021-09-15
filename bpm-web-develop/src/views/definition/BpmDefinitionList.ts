import ListPage from "@/components/list-view/ListPage";
import { Component } from "vue-property-decorator";
import ConstantMgr from "@/mgr/ConstantMgr";
import i18n from "@/i18n";
import BpmDefinitionApi from "@/http/bpm/BpmDefinitionApi";
import BpmGroupTree from "@/views/definition/components/BpmGroupTree.vue";
import BpmDefinitionEditDialog from "@/views/definition/components/BpmDefinitionEditDialog.vue";
import stateMap from "@/views/definition/BpmDefinitionStateMap";

@Component({
  name: "BpmDefinitionList",
  components: {
    BpmGroupTree,
  },
  filters: {
    state: (value: any) => {
      return i18n.t(stateMap.get(value)) || "--";
    },
  },
})
export default class BpmDefinitionList extends ListPage {
  currentGroup: any = null;
  filterParams: any = { "state:=": "enabled" };
  stateOptions: any = [
    { value: "initial", label: "未发布" },
    { value: "enabled", label: "启用" },
    { value: "disabled", label: "停用" },
  ];

  created() {
    const { query }: any = this.$route;
    if (query.state) {
      this.filterParams["state:="] = [query.state];
    }
  }

  doCreateNew() {
    this.$dialog.show(BpmDefinitionEditDialog).then((res: any) => {
      this.$router.push({ name: "BpmDefinitionEdit", query: { uuid: res.output.data.uuid } });
    });
  }

  doView(row: any) {
    this.$router.push({ name: "BpmDefinitionView", query: { uuid: row.uuid } });
  }

  doEdit(row: any) {
    this.$router.push({ name: "BpmDefinitionEdit", query: { uuid: row.uuid } });
  }

  doDisable(row: any) {
    BpmDefinitionApi.disable({
      uuid: row.uuid,
    })
      .then(() => {
        this.refreshQuery();
      })
      .catch(this.$error);
  }

  doEnable(row: any) {
    BpmDefinitionApi.enable({
      uuid: row.uuid,
    })
      .then(() => {
        this.refreshQuery();
      })
      .catch(this.$error);
  }

  doListLoad(param: any = {}) {
    const loading = this.$loading(ConstantMgr.loadingOption);
    for (const key in this.filterParams) {
      const value = this.filterParams[key];
      if (Array.isArray(value)) {
        if (value.length) {
          param.filters.push({ property: key, value });
        }
      } else if (value !== undefined && value !== null && value !== "") {
        param.filters.push({ property: key, value });
      }
    }
    BpmDefinitionApi.query(param)
      .then((resp: any) => {
        loading.close();
        this.rowData = resp.data.records;
        this.rowTotal = resp.data.recordCount;
      })
      .catch(error => {
        loading.close();
        this.$error(error);
      });
  }

  currentGroupChanged(currentGroup: any) {
    this.filterParams["group.uuid:="] = currentGroup.uuid === "-" ? "" : currentGroup.uuid;
    this.$refs.listView.load();
  }
}
