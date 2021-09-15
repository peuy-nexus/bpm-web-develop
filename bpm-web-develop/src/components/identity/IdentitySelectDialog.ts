import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ArrayUtil from "@/components/waltz-vue/utils/ArrayUtil";
import IdentityApi from "@/http/bpm/IdentityApi";

@Component({
  name: "IdentitySelectDialog",
})
export default class IdentitySelectDialog extends Vue {
  @Prop({ type: Boolean }) visible: boolean; // 显示对话框
  @Prop({ type: String }) title: string;
  @Prop({ type: String, required: true }) type: string;
  @Prop({ type: Array }) selectedList: any[]; // 已选列表
  @Prop({ type: Array }) excludeList: any[]; // 排除列表

  $refs: any;
  filterText: string = "";
  page: number = 0;
  pageSize: number = 20;
  rowData: any[] = [];
  rowTotal: number = 0;
  internalSelected: any[] = []; // 选中的对象数组
  suppressSelectionChange: boolean = false;
  controller: any;

  @Watch("selectedList", { immediate: true })
  selectedListChanged() {
    this.internalSelected = this.selectedList ? [...this.selectedList] : [];
  }

  @Watch("internalSelected", { immediate: true, deep: true })
  internalSelectedChanged() {
    this.refreshRowSelected();
  }

  mounted() {
    this.loadData();
  }

  skuSelectable(row: any) {
    return !(
      this.excludeList &&
      this.excludeList.find((value: any) => value.uuid === row.uuid && value.qpc === row.qpc) != null
    );
  }

  handleSelectionChange(e: any[]) {
    if (this.suppressSelectionChange) {
      return;
    }
    const internalSelected = [...this.internalSelected];
    ArrayUtil.remove(internalSelected, (item: any) =>
      this.rowData.find((row: any) => row.uuid === item.uuid && row.qpc === item.qpc),
    );
    e.forEach(item => {
      const target = this.internalSelected.find((value: any) => value.uuid === item.uuid && value.qpc === item.qpc);
      internalSelected.push(Object.assign({}, target, item));
    });
    this.internalSelected = internalSelected;
  }

  handleCurrentPageChange(page: number) {
    this.loadData(page);
  }

  doConfirm() {
    if (this.internalSelected.length === 0) {
      return this.$message.warning("请选择商品");
    }
    this.controller.ok(this.internalSelected);
  }

  loadData(page: number = 1) {
    this.page = page || 1;
    const param: any = {
      keyword: this.filterText || null,
      identityType: this.type,
      page: this.page - 1,
      pageSize: this.pageSize,
      sorters: [{ direction: "asc", property: "code" }],
    };
    IdentityApi.query(param)
      .then(resp => {
        this.suppressSelectionChange = true;
        this.rowData = resp.data.records;
        this.rowTotal = resp.data.recordCount;
        this.$nextTick(() => {
          this.refreshRowSelected();
        });
      })
      .catch(this.$error);
  }

  selectIdentity() {
    this.loadData();
  }

  refreshRowSelected() {
    const table: any = this.$refs.table;
    this.suppressSelectionChange = true;
    this.rowData.forEach(row => {
      const selected = this.internalSelected.find(item => row.uuid === item.uuid && row.qpc === item.qpc);
      table.toggleRowSelection(row, !!selected);
    });
    this.suppressSelectionChange = false;
  }
}
