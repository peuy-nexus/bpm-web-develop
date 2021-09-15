import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "InfoItem",
})
export default class InfoItem extends Vue {
  @Prop({ type: String }) label: boolean; // 是否显示勾选框
}
