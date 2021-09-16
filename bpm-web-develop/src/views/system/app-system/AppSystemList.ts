import ListPage from "@/components/list-view/ListPage";
import { Component } from "vue-property-decorator";
import ConstantMgr from "@/mgr/ConstantMgr";
import UserApi from "@/http/bpm/UserApi";
import AppSystemApi from "@/http/bpm/AppSystemApi";
import DelUserRoleApi from "@/http/bpm/DelUserRoleApi";
// import AppSystemEditor from "@/views/system/app-system/components/AppServiceEditor";

@Component({
  name: "AppSystemList",
  components:{
    // AppSystemEditor
  }
})
export default class AppSystemList extends ListPage {
  editForm: any = {
    code:"",
    name:"",
    uuid:""
  }
  doCreateNew() {
    this.$router.push({ name: "AppSystemEdit" });
  }

  doEdit(row: any) {
    // console.log("row", row);
    const loading = this.$loading(ConstantMgr.loadingOption);
    AppSystemApi.modify(this.editForm)
      .then((resp: any) => {
        loading.close();
        this.getData();
        this.$message({
          message: String(this.$t("流程中心.系统管理/用户管理/角色管理/用户移出角色提示")),
          type: "success",
        });
      })
      .catch((error: any) => {
        loading.close();
        this.$error(error);
      });
  }

  doDelete(row: any) {
    console.log("row", row);
    this.getData()
    // const loading = this.$loading(ConstantMgr.loadingOption);
    // AppSystemApi.delete({
    //
    // })
    //   .then((resp: any) => {
    //     loading.close();
    //     this.getData();
    //     this.$message({
    //       message: String(this.$t("流程中心.系统管理/用户管理/角色管理/用户移出角色提示")),
    //       type: "success",
    //     });
    //   })
    //   .catch((error: any) => {
    //     loading.close();
    //     this.$error(error);
    //   });
  }

  // 获取数据
  getData(){
    const loading = this.$loading(ConstantMgr.loadingOption);
    AppSystemApi.query({

    })
      .then((resp: any) => {
        this.recordsData = resp.data.records;
        console.log(this.recordsData);
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
        // console.log(resp.data.records);
        // console.log(111);
        console.log(param);
        this.rowData = resp.data.records; // 列表数据
        this.rowTotal = resp.data.recordCount; // 列表个数
        this.getData()
      })
      .catch(error => {
        loading.close();
        this.$error(error);
      });
  }
}
