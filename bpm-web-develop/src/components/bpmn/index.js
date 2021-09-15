import Vue from "vue";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";

import ProcessDesigner from "./ProcessDesigner.vue";
import ProcessViewer from "./ProcessViewer.vue";

Vue.component("ProcessDesigner", ProcessDesigner);
Vue.component("ProcessViewer", ProcessViewer);

// 全网最详bpmn.js教材目录
// 作者：LinDaiDai_霖呆呆
// 链接：https://juejin.cn/post/6844904017567416328
