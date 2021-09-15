import { Component, Prop, Vue } from "vue-property-decorator";
import BpmGroupApi from "@/http/bpm/BpmGroupApi";

@Component({
  name: "BpmGroupSelect",
})
export default class BpmGroupSelect extends Vue {
  @Prop({ type: Object }) value: any; // 组件value
  @Prop({ type: String, default: "请选择" }) placeholder: string; // 提示文本
  @Prop({ type: Boolean, default: true }) clearable: boolean;
  @Prop({ type: Boolean }) disabled: boolean;
  @Prop({ type: Boolean }) defaultExpandAll: boolean;

  treeData: any[] = [];
  treeProps: any = {
    label: "name",
  };
  $refs: any;

  mounted(): void {
    const param: any = {
      fetchParts: ["children"],
      filters: [{ property: "level:=", value: 0 }],
      sorters: [{ property: "sortIndex", direction: "asc" }],
    };
    BpmGroupApi.query(param).then(res => {
      this.treeData = res.data.records;
    });
  }

  doClearValue() {
    if (this.$refs.tree) {
      this.$refs.tree.setCurrentKey(null);
    }
    this.$emit("input", null);
    this.dispatch("ElFormItem", "el.form.change", null);
  }

  filterText(filterText: string) {
    this.$refs.tree.filter(filterText);
  }

  filterNode(filterText: string, data: any) {
    if (!filterText) return true;
    return data.name.indexOf(filterText) !== -1;
  }

  handleCurrentChange(data: any) {
    this.$emit("input", data);
    this.dispatch("ElFormItem", "el.form.change", data);
    this.$nextTick(() => {
      this.filterText("");
      this.$refs.select.handleClose();
    });
  }

  handlePopperVisibleChange() {
    this.$nextTick(() => {
      if (this.value) {
        this.$refs.tree.setCurrentKey(this.value.uuid);
      }
    });
  }

  dispatch(componentName: any, eventName: any, params: any) {
    let parent: any = this.$parent || this.$root;
    let name: string = parent.$options.componentName;

    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;

      if (parent) {
        name = parent.$options.componentName;
      }
    }
    if (parent) {
      parent.$emit(eventName, params);
    }
  }
}
