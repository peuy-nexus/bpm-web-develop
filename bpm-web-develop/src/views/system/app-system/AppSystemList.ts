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

  // 获取数据
  getData(){
    const loading = this.$loading(ConstantMgr.loadingOption);
    AppSystemApi.query({ uuid: this.roleId })
      .then((resp: any) => {
        this.userData = resp.data;
        loading.close();
      })
      .catch((error: any) => {
        loading.close();
        this.$error(error);
      });
  }

  doListLoad(param: any = {}) {
    console.log('搜索并展示');
    const loading = this.$loading(ConstantMgr.loadingOption);

    // 0915 查询
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
        this.rowData = resp.data.records; // 列表数据
        this.rowTotal = resp.data.recordCount; // 列表个数
      })
      .catch(error => {
        loading.close();
        this.$error(error);
      });
  }
}
