import ListPage from "@/components/list-view/ListPage";
import { Component } from "vue-property-decorator";
import ConstantMgr from "@/mgr/ConstantMgr";
import i18n from "@/i18n";
import BpmInstanceApi from "@/http/bpm/BpmInstanceApi";
import UserApi from "@/http/bpm/UserApi";
import WzSearch from "@/components/waltz-vue/components/search/search.vue";

@Component({
  name: "JoinedTaskList",
  components: {
    WzSearch,
  },
})
export default class JoinedTaskList extends ListPage {
  filterObject: any = {
    starter: null,
  };

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
    BpmInstanceApi.queryJoined(param)
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

  queryStarted(data: any) {
    const param: any = {};
    param.page = data.page;
    param.pageSize = 50;
    param.keyword = data.keyword;
    param.sorters = [{ direction: "filDate", property: "desc" }];
    return UserApi.query(param);
  }
}
