import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ResourceModuleApi from "@/http/bpm/ResourceModuleApi";

@Component({
  name: "ResourceModuleDialog",
})
export default class ResourceModuleDialog extends Vue {
  @Prop({ type: Boolean }) visible: boolean;
  @Prop({ type: Object }) value: any;

  filterText: string = "";
  rowData: any[] = [];
  internalSelected: any[] = []; // 选中的对象数组

  @Watch("internalSelected", { immediate: true, deep: true })
  internalSelectedChanged() {
    this.refreshRowSelected();
  }

  mounted(): void {
    this.doQuery();
  }

  doQuery() {
    const param: any = {
      keyword: this.filterText,
    };
    ResourceModuleApi.query(param).then(res => {
      this.rowData = res.data;
    });
  }

  doConfirm() {
    console.log("handleSelectRowChange");
  }

  handleSelectRowChange(e: any) {
    if (this.suppressSelectionChange) {
      return;
    }
    this.internalSelected = e.slice(e.length - 1);
  }

  refreshRowSelected() {
    const table: any = this.$refs.table;
    this.suppressSelectionChange = true;
    this.rowData.forEach(row => {
      const selected = this.internalSelected.find(item => row.id === item.id && row.qpc === item.qpc);
      table.toggleRowSelection(row, !!selected);
    });
    this.suppressSelectionChange = false;
  }
}
