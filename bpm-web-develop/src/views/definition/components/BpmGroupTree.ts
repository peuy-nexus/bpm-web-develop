import { Component, Prop, Vue } from "vue-property-decorator";
import BpmGroupApi from "@/http/bpm/BpmGroupApi";
import BpmGroupEditDialog from "@/views/definition/components/BpmGroupEditDialog.vue";

@Component({
  name: "BpmGroupTree",
})
export default class BpmGroupTree extends Vue {
  @Prop({ type: Object }) value: any;

  filterText: string = "";
  currentGroup: any = "";
  treeData: any = [];
  treeProps: any = {
    label: (data: any) => `${data.name}`,
  };

  $refs: any;

  mounted(): void {
    this.doQuery();
  }

  filterNode(value: any, data: any) {
    if (!value) return true;

    const reg = new RegExp("^(.*" + value + ".*)$");
    return data.name && reg.test(data.name.toUpperCase());
  }

  doQuery() {
    const param: any = {
      fetchParts: ["children"],
      filters: [{ property: "level:=", value: 0 }],
      sorters: [{ property: "sortIndex", direction: "asc" }],
    };
    BpmGroupApi.query(param).then(res => {
      this.treeData = [
        {
          uuid: "-",
          name: "全部",
          children: res.data.records,
        },
      ];
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey((this.currentGroup && this.currentGroup.uuid) || "-");
      });
    });
  }

  doCreateNew() {
    this.$dialog.show(BpmGroupEditDialog).then((res: any) => {
      if (!res.wasCancelled) {
        this.doQuery();
      }
    });
  }

  doDelete(data: any) {
    BpmGroupApi.delete({
      uuid: data.uuid,
    })
      .then((res: any) => {
        this.doQuery();
      })
      .catch((error: any) => {
        this.$error(error);
      });
  }

  doEdit(target: any, node: any, event: any) {
    event.stopPropagation();
    const upper = Object.assign({ uuid: "-" }, node.parent && node.parent.data);
    this.$dialog
      .show(BpmGroupEditDialog, {
        value: target,
        upper: upper.uuid === "-" ? null : upper,
      })
      .then((res: any) => {
        if (!res.wasCancelled) {
          this.doQuery();
        }
      });
  }

  doTreeFilter() {
    this.$refs.tree.filter(this.filterText);
  }

  handleCurrentChange(data: any, node: any) {
    this.currentGroup = data;
    this.$emit("currentGroupChanged", this.currentGroup);
  }

  handleDragStart(node: any, ev: any) {
    console.log("drag start", node);
  }

  handleDragEnter(draggingNode: any, dropNode: any, ev: any) {
    console.log("tree drag enter: ", dropNode.label);
  }

  handleDragLeave(draggingNode: any, dropNode: any, ev: any) {
    console.log("tree drag leave: ", dropNode.label);
  }

  handleDragOver(draggingNode: any, dropNode: any, ev: any) {
    console.log("tree drag over: ", dropNode.label);
  }

  handleDragEnd(draggingNode: any, dropNode: any, dropType: any, ev: any) {
    console.log("tree drag end: ", dropNode && dropNode.label, dropType);
  }

  handleDrop(draggingNode: any, dropNode: any, dropType: any, ev: any) {
    console.log("tree drop: ", dropNode.label, dropType);
  }

  allowDrop(draggingNode: any, dropNode: any, type: any) {
    if (type === "inner" || !dropNode.data.uuid || dropNode.data.uuid === "-") {
      return false;
    } else {
      return (
        draggingNode.data.upper === dropNode.data.upper ||
        (draggingNode.data.upper && dropNode.data.upper && draggingNode.data.upper.uuid === dropNode.data.upper.uuid)
      );
    }
  }

  allowDrag(draggingNode: any) {
    return draggingNode.data.uuid;
  }
}
