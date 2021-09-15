import ListPage from "@/components/list-view/ListPage";
import { Component } from "vue-property-decorator";
import ConstantMgr from "@/mgr/ConstantMgr";
import UserApi from "@/http/bpm/UserApi";
import AppSystemApi from "@/http/bpm/AppSystemApi";

@Component({
  name: "AppSystemList",
})
export default class AppSystemList extends ListPage {
  doCreateNew() {
    console.log('新增');
    this.$router.push({ name: "AppSystemEdit" });
  }

  doEdit(row: any) {
    console.log("编辑");
    console.log("row", row);
  }

  doDelete(row: any) {
    console.log("删除");
    console.log("row", row);
  }

  doListLoad(param: any = {}) {
    console.log('搜索并展示');
    const loading = this.$loading(ConstantMgr.loadingOption);
    AppSystemApi.query(
      Object.assign(
        param,
        {
          fetchParts: ["roles"],
        },
        this.filterParams,
      ),
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
}
