import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "AuthLink",
})
export default class AuthLink extends Vue {
  @Prop({ type: String }) permission: string;

  hasPermission: any;

  handleClick(event: any) {
    if (!this.hasPermission(this.permission)) {
      event.stopPropagation();
    }
    this.$emit("click", event);
  }
}
