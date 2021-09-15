import { Component, Prop, Vue } from "vue-property-decorator";
import ResourceModuleApi from "@/http/bpm/ResourceModuleApi";
import IdentityApi from "@/http/bpm/IdentityApi";

@Component({
  name: "IdentitySelect",
})
export default class IdentitySelect extends Vue {
  @Prop({ type: [Object, Array] }) value: any; // 组件value
  @Prop({ type: String, required: true }) type: string;
  @Prop({ type: String, default: "身份" }) placeholder: string;
  @Prop({ type: Boolean }) multiple: boolean;
  @Prop({ type: Boolean, default: true }) clearable: boolean;

  pageSize = 50;

  handleValueChange(e: any) {
    this.$emit("input", e);
  }

  queryData(data: any) {
    const param: any = {
      keyword: data.keyword,
      page: data.page,
      pageSize: this.pageSize,
      identityType: this.type,
    };
    return IdentityApi.query(param);
  }
}
