import ListPage from "@/components/list-view/ListPage";
import { Component } from "vue-property-decorator";
import ConstantMgr from "@/mgr/ConstantMgr";
import UserApi from "@/http/bpm/UserApi";
import AppSystemApi from "@/http/bpm/AppSystemApi";
import DelUserRoleApi from "@/http/bpm/DelUserRoleApi";

@Component({
  name: "AppSystemList"
})
export default class AppSystemList extends ListPage {
  editForm: any = {
    uuid:"",
    code:"",
    name:""
  };
  editFormVisible: boolean = false;
  // 规则验证
  rules: any = {
    name: [
      {
        required: true,
        message: String(this.$t("流程中心.系统管理/应用系统/名称/输入提示")),
        trigger: ["blur"],
      },
    ],
    code:[
      {
        required: true,
        message: String(this.$t("流程中心.系统管理/应用系统/名称/输入提示")),
        trigger: ["blur"],
      },
    ]
  };

  doCreateNew() {
    this.$router.push({ name: "AppSystemEdit" });
  }

  doEdit(row: any) {
    console.log("row", row);
    console.log('edit');
    const loading = this.$loading(ConstantMgr.loadingOption);
    AppSystemApi.modify(this.editForm)
      .then((resp: any) => {
        loading.close();
        this.$message({
          message: String(this.$t("流程中心.系统管理/用户管理/角色管理/角色修改提示")),
          type: "success",
        });
        this.doListLoad()
      })
      .catch((error: any) => {
        loading.close();
        this.$error(error);
      });
    this.editFormVisible = false;
  }

  // 展示修改框
  editShow(row: any) {
    this.editForm.uuid = row.uuid;
    this.editForm.code = row.code;
    this.editForm.name = row.name;
    this.editFormVisible = true;
    console.log('弹出对话框');
    console.log(this.editForm.uuid);
    console.log(this.editForm.code);
    console.log(this.editForm.name);
  }
  // 关闭修改框
  editCancel(){
    this.editFormVisible = false;
  }

  doDelete(row: any) {
    console.log('del');
    console.log("row", row.uuid);
    // const loading = this.$loading(ConstantMgr.loadingOption);
    // AppSystemApi.delete({uuid: row.uuid})
    //   .then((res: any) => {
    //     this.$message({
    //       message: String(this.$t("流程中心.系统管理/用户管理/角色管理/角色删除提示")),
    //       type: "success",
    //     });
    //     this.doListLoad()
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
        // console.log(this.recordsData);
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
        console.log(param);
        this.rowData = resp.data.records; // 列表数据
        this.rowTotal = resp.data.recordCount; // 列表个数
      })
      .catch(error => {
        loading.close();
        this.$error(error);
      });
  }
}
