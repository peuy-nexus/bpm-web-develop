import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import BpmnModeler from "bpmn-js/lib/Modeler";
import DefaultEmptyXML from "./defaultEmpty";

// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
// import CustomContentPadProvider from "../package/process-designer/plugins/content-pad";
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import PaletteProvider from "./custom/palette";
import ContextPadProvider from "./custom/context-pad";
import Modeling from "./custom/modeling";
import * as flowableModdleDescriptor from "./descriptor/flowableDescriptor.json";

// 翻译
import customTranslate from "./custom/translate/customTranslate";
import translationsCN from "./custom/translate/zh";

const EVENT_NAMES: string[] = [
  "import.done",
  "selection.changed",
  "element.changed",
  "commandStack.changed",
  "shape.added",
  "shape.removed",
  "connection.added",
  "connection.removed",
];

@Component({
  name: "ProcessDesigner",
})
export default class ProcessDesigner extends Vue {
  @Prop({ type: String }) value: string;
  @Prop({ type: Object }) extend: any;
  @Prop({ type: Boolean, default: true }) keyboard: boolean;

  modeling: any;
  bpmnModeler: any;
  importingXml: boolean = false;

  get additionalModules() {
    const modules = [];
    // 翻译模块
    const TranslateModule = {
      translate: ["value", customTranslate(this.translations || translationsCN)],
    };
    modules.push(TranslateModule);
    // 自定义工具栏(调色板)
    modules.push(PaletteProvider);
    // 自定义小弹窗
    modules.push(ContextPadProvider);
    // 自定义渲染器，暂时不需要
    // modules.push(CustomRenderer);
    // 自定义modeling
    modules.push(Modeling);

    if (this.readonly) {
      modules.push({
        paletteProvider: ["value", ""], // 禁用左面板
        labelEditingProvider: ["value", ""], // 禁用编辑
        contextPadProvider: ["value", ""], // 禁用点击出现的contextPad
      });
    }
    return modules;
  }

  get moddleExtensions() {
    return {
      flowable: flowableModdleDescriptor,
    };
  }

  @Watch("value")
  async valueChanged() {
    if (!this.bpmnModeler) {
      return;
    }
    this.importXML(this.value);
  }

  mounted() {
    this.initBpmnModeler();
    this.importXML(this.value);
    this.$once("hook:beforeDestroy", () => {
      if (this.bpmnModeler) this.bpmnModeler.destroy();
      this.$emit("destroy", this.bpmnModeler);
      this.bpmnModeler = null;
    });
  }

  initBpmnModeler() {
    if (this.bpmnModeler) return;
    this.bpmnModeler = new BpmnModeler({
      container: this.$refs.canvas,
      keyboard: this.keyboard ? { bindTo: document } : null,
      additionalModules: this.additionalModules,
      moddleExtensions: this.moddleExtensions,
    });
    this.modeling = this.bpmnModeler.get("modeling");
    this.$emit("init-finished", this.bpmnModeler);

    this.initModelListeners();
  }

  /* 创建新的流程图 */
  async importXML(value: any) {
    if (!value) {
      return;
    }
    // 将字符串转换成图显示出来
    const newId = this.processId || `Process_${new Date().getTime()}`;
    const newName = this.processName || `业务流程_${new Date().getTime()}`;
    const xmlString = value || DefaultEmptyXML(newId, newName, this.prefix);
    try {
      this.importingXml = true;
      const { warnings } = await this.bpmnModeler.importXML(xmlString);
      if (warnings && warnings.length) {
        warnings.forEach((warn: any) => console.warn(warn));
      }
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e.message || e}`);
    }
  }

  initModelListeners() {
    const eventBus = this.bpmnModeler.get("eventBus");
    // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
    EVENT_NAMES.forEach((eventName: any) => {
      eventBus.on(eventName, (event: any) => {
        if (eventName === "import.done") {
          this.importingXml = false;
        }
        if (this.importingXml) return;
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
}
