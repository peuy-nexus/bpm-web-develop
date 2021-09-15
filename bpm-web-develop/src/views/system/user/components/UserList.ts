import ListPage from "@/components/list-view/ListPage";
import { Component } from "vue-property-decorator";
import ConstantMgr from "@/mgr/ConstantMgr";
import UserApi from "@/http/bpm/UserApi";
import { State } from "vuex-class";

@Component({
  name: "UserList",
})
export default class UserList extends ListPage {
  @State("systemConfig") systemConfig: any;

  get hidePost() {
    return !this.systemConfig.identityType && this.systemConfig.identityTypes.indexOf("post") < 0;
  }

  get hideDepartment() {
    return !this.systemConfig.identityType && this.systemConfig.identityTypes.indexOf("department") < 0;
  }

  doListLoad(param: any = {}) {
    const loading = this.$loading(ConstantMgr.loadingOption);
    UserApi.query(
      Object.assign(
        param,
        {
          fetchParts: ["roles", "posts", "departments"],
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
