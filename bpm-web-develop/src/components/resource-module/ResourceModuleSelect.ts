import { Component, Prop, Vue } from "vue-property-decorator";
import ResourceModuleApi from "@/http/bpm/ResourceModuleApi";

@Component({
  name: "ResourceModuleSelect",
})
export default class ResourceModuleSelect extends Vue {
  @Prop({ type: Object }) value: string; // 组件value
  @Prop({ type: String, default: "模块" }) placeholder: string;
  @Prop({ type: Boolean, default: true }) clearable: boolean;

  handleValueChange(e: any) {
    this.$emit("input", e);
  }

  queryData(data: any) {
    const param: any = {
      keyword: data.keyword,
      fetchParts: ["pages", "pages.params", "actions", "variables"],
    };
    return ResourceModuleApi.query(param).then(res => {
      return Promise.resolve({
        data: {
          pageCount: 1,
          records: res.data.records,
        },
      });
    });
  }
}
