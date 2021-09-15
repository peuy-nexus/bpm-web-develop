import { Component, PropSync, Vue, Watch } from "vue-property-decorator";
import RoleApi from "@/http/bpm/RoleApi";

@Component({
  name: "RolePermissionCard",
})
export default class RolePermissionCard extends Vue {
  @PropSync("processData", { type: Array }) processManagementData: any;

  mounted(): void {
    console.log(this.processManagementData);
  }
  // 店务管理的表格展示
  powerShowClick(item: any) {
    item.expand = !item.expand;
  }

  // // powerDate 每个项item的选中状态
  RolePermissionItemChange(data: any, AllData: any) {
    const rowSome = data.children.some((item: any) => {
      return item.checked === true;
    });
    const rowEvery = data.children.every((item: any) => {
      return item.checked === true;
    });
    // 行判断
    // 如果有起码一个为选中状态
    if (rowSome === true) {
      data.isIndeterminate = true;
      data.checked = false;
    } else {
      // 一个选中状态都没有
      data.isIndeterminate = false;
      if (rowEvery === false) data.checked = false;
    }
    // 如果有全部为选中状态
    if (rowEvery === true) {
      data.checked = true;
      data.isIndeterminate = false;
    }
    this.AlldataHald(AllData);
  }
  //
  // // 点击表，表下面的全部选中或取消
  RolePermissionAll(item: any, check: boolean) {
    item.isIndeterminate = false;
    item.checked = check;
    if (item.children) {
      item.children.forEach((it: any) => {
        it.checked = check;
        this.RolePermissionAll(it, check);
      });
    } else {
      item.checked = check;
    }
  }
  //
  // // 行item 选中状态改变
  RolePermissionRowchange(data: any, check: boolean, AllData: any) {
    data.children.forEach((item: any) => {
      item.checked = check;
      data.isIndeterminate = false;
    });
    this.AlldataHald(AllData);
  }
  AlldataHald(AllData: any) {
    // 表判断
    const tableSome = AllData.children.some((item: any) => {
      return item.checked === true || item.isIndeterminate === true;
    });
    const tableEvery = AllData.children.every((item: any) => {
      return item.checked === true;
    });
    if (tableEvery) {
      AllData.checked = true;
      AllData.isIndeterminate = false;
    } else if (tableSome) {
      AllData.checked = false;
      AllData.isIndeterminate = true;
    } else {
      AllData.checked = false;
      AllData.isIndeterminate = false;
    }
  }
}
