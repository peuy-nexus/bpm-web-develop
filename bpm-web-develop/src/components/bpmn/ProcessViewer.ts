import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";

const EVENT_NAMES = ["import.done", "selection.changed", "element.changed"];
@Component({
  name: "ProcessViewer",
})
export default class ProcessViewer extends Vue {
  @Prop({ type: String }) value: string;
  @Prop({ type: Object }) extend: any;

  @Watch("value")
  async valueChanged() {
    if (!this.bpmnViewer) {
      return;
    }
    this.importXML(this.value);
  }

  mounted() {
    this.initBpmnViewer();
    this.importXML(this.value);
    this.$once("hook:beforeDestroy", () => {
      if (this.bpmnModeler) this.bpmnModeler.destroy();
      this.$emit("destroy", this.bpmnModeler);
      this.bpmnModeler = null;
    });
  }

  async initBpmnViewer() {
    this.bpmnViewer = new BpmnViewer({
      container: this.$refs["canvas"],
      bpmnRenderer: {
        // defaultFillColor: "rgba(30,30,30,1)",
        // defaultStrokeColor: "red"
      },
    });
    this.initModelListeners();
  }

  initModelListeners() {
    const eventBus = this.bpmnViewer.get("eventBus");
    // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
    EVENT_NAMES.forEach((eventName: any) => {
      eventBus.on(eventName, (event: any) => {
        console.log("eventBus", eventName, event);
        this.$emit(eventName.replace(/\./g, "-"), event);
      });
    });
    // // 监听图形改变返回xml
    // eventBus.on("commandStack.changed", async (event: any) => {
    //   try {
    //     this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
    //     this.revocable = this.bpmnModeler.get("commandStack").canUndo();
    //     const { xml } = await this.bpmnModeler.saveXML({ format: true });
    //     this.$emit("commandStack-changed", event);
    //     this.$emit("input", xml);
    //     this.$emit("change", xml);
    //   } catch (e) {
    //     console.error(`[Process Designer Warn]: ${e.message || e}`);
    //   }
    // });
    // // 监听视图缩放变化
    // this.bpmnModeler.on("canvas.viewbox.changed", ({ viewbox }: any) => {
    //   this.$emit("canvas-viewbox-changed", { viewbox });
    //   const { scale } = viewbox;
    //   this.defaultZoom = Math.floor(scale * 100) / 100;
    // });
  }

  async importXML(value: any) {
    if (!value) {
      return;
    }
    const { warnings } = await this.bpmnViewer.importXML(value);
    if (warnings && warnings.length) {
      warnings.forEach((warn: any) => console.warn(warn));
    }
  }
}
