import ListPage from "@/components/list-view/ListPage";
import { Component } from "vue-property-decorator";
import ConstantMgr from "@/mgr/ConstantMgr";
import i18n from "@/i18n";
import BpmInstanceApi from "@/http/bpm/BpmInstanceApi";

@Component({
  name: "StartedTaskList",
})
export default class StartedTaskList extends ListPage {
  doView(row: any) {
    this.$router.push({ name: "BpmDefinitionView", query: { uuid: row.uuid } });
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
    BpmInstanceApi.queryStarter(param)
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
}
