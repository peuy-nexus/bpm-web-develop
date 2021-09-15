import { Vue, Component, Prop } from "vue-property-decorator";

// const TYPE_CLASSES_MAP = {
//     'success': 'el-icon-success',
//     'warning': 'el-icon-warning',
//     'error': 'el-icon-error'
// };
@Component({
  components: {},
})
export default class DetailCard extends Vue {
  @Prop({ type: Boolean, default: true }) showTag: boolean; // 是否展示标题前的竖线
  @Prop({ type: [String, Boolean], default: "" }) title: string | boolean; // 是否展示标题前的竖线
  @Prop({ type: String, default: "info" }) type: string; // 卡片类型

  // 卡片背景样式
  get typeClass() {
    return `card-${this.type}`;
  }
}
