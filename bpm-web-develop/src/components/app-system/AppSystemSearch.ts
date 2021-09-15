import { Component, Prop, Vue } from "vue-property-decorator";
import i18n from "@/i18n";
import PostApi from "@/http/bpm/PostApi";
import AppSystemApi from "@/http/bpm/AppSystemApi";

@Component({
  name: "AppSystemSearch",
})
export default class AppSystemSearch extends Vue {
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
      filters: [],
      page: data.page,
      pageSize: this.pageSize,
    };
    if (data.keyword) {
      param.filters.push({ property: "codeName", value: data.keyword });
    }
    // return AppSystemApi.query(param);
    return Promise.resolve({
      data: {
        records: [
          {
            uuid: "128878255232888832",
            code: "H6",
            name: "HDPos4.6",
          },
        ],
      },
    });
  }
}
