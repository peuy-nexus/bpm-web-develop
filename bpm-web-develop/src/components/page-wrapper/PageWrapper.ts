import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class PageWrapper extends Vue {
  @Prop({ type: Array }) breadCrumb: any;
  @Prop({ type: Boolean, default: false }) isList: boolean;

  handleBreadcrumbClick(item: any) {
    this.$router.push(item.route);
  }
}
