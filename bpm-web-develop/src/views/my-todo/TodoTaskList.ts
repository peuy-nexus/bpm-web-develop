import ListPage from "@/components/list-view/ListPage";
import { Component } from "vue-property-decorator";
import ConstantMgr from "@/mgr/ConstantMgr";
import i18n from "@/i18n";
import BpmDefinitionApi from "@/http/bpm/BpmDefinitionApi";
import TodoCountTree from "@/views/my-todo/components/TodoCountTree.vue";
import BpmDefinitionEditDialog from "@/views/definition/components/BpmDefinitionEditDialog.vue";
import UserTaskApi from "@/http/bpm/UserTaskApi";

@Component({
  name: "TodoTaskList",
  components: {
    TodoCountTree,
  },
})
export default class TodoTaskList extends ListPage {
  currentGroup: any = null;

  handleFilterChanged(event: any) {
    console.log(event);
  }

  doView(row: any) {
    this.$router.push({ name: "BpmDefinitionView", query: { uuid: row.uuid } });
  }

  doComplete(row: any) {
    this.$router.push({ name: "BpmDefinitionView", query: { uuid: row.uuid } });
  }

  doClaim(row: any) {
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
    UserTaskApi.queryTodo(
      Object.assign({}, param, {
        fetchParts: ["bpmInstance"],
      }),
    )
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
