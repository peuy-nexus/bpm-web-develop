import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { CommonUtil } from "fant-ui";
import { addResizeListener, removeResizeListener } from "fant-ui/lib/utils/resize-event";

// 筛选参数
class FilterParam {
  // 查询条件运算,格式为“field:<操作符>”
  property: Nullable<string> = null;
  // 查询参数
  value: any;
}

// 排序参数
class SortParam {
  // 排序字段
  property: Nullable<string> = null;
  // 排序方式，默认倒叙
  direction: Nullable<string> = null;
}

// 查询参数
class QueryParam {
  filters: FilterParam[] = [];
  sorters: SortParam[] = [];
  fetchParts: string[] = [];
  page: number = 0;
  pageSize: number = 0;
}

@Component({
  name: "ListView",
})
export default class ListView extends Vue {
  @Prop({ type: Number, default: 0 }) rowTotal: number; // 选项总数
  @Prop({ type: Array, default: () => [] }) rowData: any[];
  @Prop({ type: [Boolean, Function], default: false }) selectable: any; // 是否显示勾选框
  @Prop({ type: Boolean, default: true }) pageable: boolean; // 是否显示分页
  @Prop({ type: Boolean, default: true }) stripe: boolean; // 是否斑马纹
  @Prop({ type: Boolean, default: true }) showHeader: boolean; // 是否显示表头
  @Prop({ type: String, default: "prev, pager, next, slot" }) layout: string; // 分页控件布局
  @Prop() emptyText: string;
  @Prop() height: number;
  @Prop() defaultSort: any; // 默认排序
  @Prop({ type: String, default: "uuid" }) rowKey: any; // 行id 配合reserve-selection使用
  @Prop({ type: Boolean, default: true }) reserveSelection: boolean; // 跨页选中
  @Prop({ type: Boolean, default: false }) highlightCurrentRow: boolean;
  @Prop({ type: Boolean }) queryToggle: boolean; // 是否重新计算列表高度

  checkSelectable(row: any, index: number) {
    if (typeof this.selectable === "boolean") {
      return this.selectable;
    } else if (typeof this.selectable === "function") {
      return this.selectable(row, index);
    }
    return false;
  }

  internalSelected: any[] = []; // 选中的对象数组
  internalDefaultSort: any = {};
  queryParam: QueryParam = new QueryParam();
  $refs: any;

  pageSizes: number[] = [10, 30, 50, 100];
  maxHeight: number = 200;
  debouncedOnHeightChange: any;

  get internalPage() {
    return this.queryParam.page + 1;
  }

  @Watch("selectable", { immediate: true })
  selectableTest() {
    if (this.selectable !== undefined && this.selectable) {
      this.$nextTick(() => {
        this.maxHeight = this.$refs.listView.offsetHeight - 60;
        if (this.$refs.actions && this.$refs.actions.offsetHeight) {
          this.maxHeight = this.$refs.listView.offsetHeight - this.$refs.actions.offsetHeight - 60;
        }
      });
    }
  }

  @Watch("queryToggle", { immediate: true })
  queryToggleChanged() {
    if (this.debouncedOnHeightChange) {
      // this.debouncedOnHeightChange();
      this.$nextTick(() => {
        console.log("queryToggleChanged12", this.$el.clientHeight);
      });
    }
  }

  created() {
    if (this.defaultSort) {
      this.internalDefaultSort = {
        prop: this.defaultSort.property,
        order: this.defaultSort.direction === "asc" ? "ascending" : "descending",
      };
      this.queryParam.sorters = [this.defaultSort];
    }
    this.queryParam.page = 0;
    this.queryParam.pageSize = 10;
  }

  mounted() {
    addResizeListener(this.$el, () => {
      if (!this.$refs.listView) return;
      this.maxHeight = this.$refs.listView.offsetHeight;
      if (this.$refs.actions && this.$refs.actions.offsetHeight) {
        this.maxHeight -= this.$refs.actions.offsetHeight;
      }
      if (this.$refs.paging && this.$refs.paging.offsetHeight) {
        this.maxHeight -= this.$refs.paging.offsetHeight;
      }
    });
    // this.$nextTick(() => {
    //   this.maxHeight = this.$refs.listView.offsetHeight - 60;
    //   if (this.$refs.actions && this.$refs.actions.offsetHeight) {
    //     this.maxHeight = this.$refs.listView.offsetHeight - this.$refs.actions.offsetHeight - 60;
    //   }
    // });
  }

  destroyed() {
    if (this.resizeListener) removeResizeListener(this.$el, this.resizeListener);
  }

  doSelectionChange(arr: any) {
    this.internalSelected = arr;
    this.$emit("selected", this.internalSelected);
  }

  /**
   * 表格排序
   */
  doSortChange({ column, prop, order }: any) {
    order === "ascending" ? (order = "asc") : (order = "desc");
    const sorts = [];
    column && prop && order && sorts.push({ property: prop, direction: order });
    this.queryParam.page = 0;
    this.queryParam.sorters = sorts;
    this.$emit("load", CommonUtil.copy(this.queryParam));
  }

  /**
   * 取消选中
   */
  clearSelection() {
    this.$refs.table.clearSelection();
  }

  /**
   * 取消多级表格的勾选状态
   */
  doToggleSelection(rows: any, selected: boolean = false) {
    if (rows) {
      rows.forEach((row: any) => {
        this.$refs.table.toggleRowSelection(row, selected);
      });
    } else {
      this.$refs.table.clearSelection();
    }
  }

  /**
   * 行点击事件
   */
  doRowClick(row: any, event: any, column: any) {
    this.$emit("RowClick", row, event, column);
  }

  /**
   * 分页回调
   */
  doPageChange(internalPage: number) {
    this.$refs.table.clearSelection();
    this.queryParam.page = internalPage - 1;
    this.$emit("load", CommonUtil.copy(this.queryParam));
  }

  /**
   * 每页多少条change
   */
  doSizeChange(pageSize: number) {
    this.queryParam.pageSize = pageSize;
    this.reset();
    this.$emit("change", pageSize); // 添加更改limit值的change事件
  }

  load() {
    this.$emit("load", CommonUtil.copy(this.queryParam));
  }

  search() {
    this.clearSelection(); // 解决编辑已勾选数据后，internalSelected不改变的问题
    this.$emit("load", CommonUtil.copy(this.queryParam));
  }

  reset() {
    this.clearSelection(); // 解决编辑已勾选数据后，internalSelected不改变的问题
    this.queryParam.page = 0;
    this.$emit("load", CommonUtil.copy(this.queryParam));
  }
}
