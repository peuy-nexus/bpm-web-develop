import { Component, Prop, Vue } from "vue-property-decorator";
import i18n from "@/i18n";
import PostApi from "@/http/bpm/PostApi";

@Component({
  name: "PostSearch",
})
export default class PostSearch extends Vue {
  @Prop({ type: [Object, Array] }) value: any; // 组件value
  @Prop({ type: String, default: i18n.t("公共.请选择") }) placeholder: string;
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
    };
    return PostApi.query(param);
  }
}
