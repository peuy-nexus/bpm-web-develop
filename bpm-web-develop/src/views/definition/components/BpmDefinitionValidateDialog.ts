import { Component, Prop, Vue } from "vue-property-decorator";
import convert from "xml-js";

@Component({
  name: "BpmDefinitionValidateDialog",
})
export default class BpmDefinitionValidateDialog extends Vue {
  @Prop({ type: Boolean }) visible: boolean;
  @Prop({ type: String }) modelXml: any;

  msgList: any[] = [];
  processList: any[] = [];
  validating: boolean = false;
  timer: any;
  $refs: any;

  get rowData() {
    return [];
  }

  mounted() {
    this.validating = true;
    this.timer = setInterval(() => {
      if (this.processList.length) {
        this.msgList.push(...this.processList.splice(0, 1));
      }
    }, 50);
    this.$nextTick(() => {
      this.validate();
    });
  }

  beforeDestroy() {
    clearInterval(this.timer);
  }

  validate() {
    this.previewResult = convert.xml2json(this.modelXml, { spaces: 2 });
    this.validateStartEvent()
      .then(() => this.validateUserTasks())
      .then(() => this.validateSequenceFlows())
      .then(() => this.validateEndEvent())
      .then(() => {
        console.log("验证结束");
      });
  }

  validateStartEvent() {
    return Promise.resolve();
  }

  validateUserTasks() {
    return Promise.resolve();
  }

  validateSequenceFlows() {
    return Promise.resolve();
  }

  validateEndEvent() {
    return Promise.resolve();
  }
}
