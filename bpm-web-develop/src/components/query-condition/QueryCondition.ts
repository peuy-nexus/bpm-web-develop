import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "QueryCondition",
})
export default class QueryCondition extends Vue {
  togglable: boolean = false; // 是否展开
  showToggle: boolean = false; // 是否展开
  opened: boolean = false; // 是否展开
  @Prop({ type: Array, default: () => ["search", "reset"] }) actions: string[];

  $refs: any;

  mounted(): void {
    this.togglable = this.$refs.action && this.$refs.action.$el.offsetTop > 0;
    if (this.togglable) {
      this.$nextTick(() => {
        this.showToggle = this.$refs.row.$el.scrollHeight > this.$refs.row.$el.clientHeight;
      });
    }
  }

  /**
   * 键盘事件
   */
  bindFastCode(ev: KeyboardEvent) {
    if (ev.keyCode === 13) {
      // 如果是input，则回车触发查询
      const input = ev.target as any;
      if (this.$refs.queryCondition.$el.contains(input) && input.type && input.type === "text") {
        this.doSearch();
      }
    }
  }

  doSearch() {
    this.$emit("search");
  }

  doReset() {
    this.$emit("reset");
  }

  doExport() {
    this.$emit("export");
  }

  doToggle() {
    this.opened = !this.opened;
    this.$emit("toggle");
  }
}
