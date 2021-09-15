import { Component, Prop, Vue } from "vue-property-decorator";
import StringUtil from "@/components/waltz-vue/utils/StringUtil";
import BpmGroupApi from "@/http/bpm/BpmGroupApi";
import UserTaskApi from "@/http/bpm/UserTaskApi";

@Component({
  name: "BpmGroupTree",
})
export default class TodoCountTree extends Vue {
  @Prop({ type: Object }) value: any;

  filterText: string = "";

  bpmGroups: any[] = [];
  countTodo: any = {};

  treeData: any = [];
  treeProps: any = {
    label: (data: any) => `${data.name}`,
  };

  $refs: any;

  mounted(): void {
    Promise.all([this.doQueryTree(), this.doQueryCount()]).then(() => {
      const children = this.buildTree(this.bpmGroups, this.countTodo);
      let totalCount = 0;
      children.forEach((child: any) => {
        totalCount += child.totalCount;
      });
      this.treeData = [
        {
          uuid: "-",
          name: "全部",
          totalCount,
          children,
        },
      ];
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey((this.currentGroup && this.currentGroup.uuid) || "-");
      });
    });
  }

  buildTree(bpmGroups: any[], countTodo: any) {
    const result: any[] = [];
    if (!bpmGroups) {
      return result;
    }
    bpmGroups.forEach(item => {
      item.children = this.buildTree(item.children, countTodo);

      if (countTodo[item.uuid]) {
        item.children.push(...countTodo[item.uuid]);
      }
      let totalCount = 0;
      item.children.forEach((child: any) => {
        totalCount += child.totalCount;
      });
      if (totalCount > 0) {
        result.push(Object.assign({ nodeType: "bpmGroup", totalCount }, item));
      }
    });
    return result;
  }

  filterNode(value: any, data: any) {
    if (!value) return true;

    const reg = new RegExp("^(.*" + value + ".*)$");
    return data.name && reg.test(data.name.toUpperCase());
  }

  doQueryTree() {
    const param: any = {
      fetchParts: ["children"],
      filters: [{ property: "level:=", value: 0 }],
      sorters: [{ property: "sortIndex", direction: "asc" }],
    };
    return BpmGroupApi.query(param).then(res => {
      this.bpmGroups = res.data.records;
    });
  }

  doQueryCount() {
    return UserTaskApi.countTodo({}).then(res => {
      const countTodo: any = {};
      res.data.forEach((item: any) => {
        if (!countTodo[item.group.uuid]) {
          countTodo[item.group.uuid] = [];
        }
        countTodo[item.group.uuid].push(Object.assign({ nodeType: "process", uuid: StringUtil.uuid() }, item));
      });
      this.countTodo = countTodo;
      console.log("doQueryCount", this.countTodo);
    });
  }

  doTreeFilter() {
    this.$refs.tree.filter(this.filterText);
  }

  handleCurrentChange(data: any, node: any) {
    this.currentGroup = data;
    this.$emit("currentGroupChanged", this.currentGroup);
  }
}
