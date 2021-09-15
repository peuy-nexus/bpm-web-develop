import "./protype";
import BatchProcessor from "./components/batch-processor/BatchProcessor";

import ArrayUtil from "./utils/ArrayUtil";
import NumberUtil from "./utils/NumberUtil";
import WzInputNumber from "./components/input-number/input-number";
import WzSearch from "./components/search/search";
import WzScrollbar from "./components/scrollbar/main";
import WzFileUpload from "./components/upload/file-upload";
import WzImageUpload from "./components/upload/image-upload";
import WzVideoUpload from "./components/upload/video-upload";

import {
  ROUND_CEILING,
  ROUND_DOWN,
  ROUND_FLOOR,
  ROUND_HALF_DOWN,
  ROUND_HALF_EVEN,
  ROUND_HALF_UP,
  ROUND_UNNECESSARY,
  ROUND_UP,
} from "./utils/RoundingMode";
import StringUtil from "./utils/StringUtil";

import DialogService from "./dialog/DialogService";
import BatchExecute from "./dialog/BatchExecute";
import UrlUtil from "./utils/url-utils";
import Rules from "./rules/validator";

const components = [BatchProcessor, WzInputNumber, WzSearch, WzScrollbar, WzFileUpload, WzImageUpload, WzVideoUpload];

const install = function(Vue) {
  if (install.installed) return;

  Vue.prototype.$dialog = DialogService;
  Vue.prototype.$batch = BatchExecute;
  Vue.prototype.$rules = Rules;
  Vue.prototype.$url = UrlUtil;
  components.map(component => Vue.component(component.name, component));
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,

  BatchProcessor,
  WzInputNumber,
  WzSearch,
  WzScrollbar,
  WzFileUpload,
  WzImageUpload,
  WzVideoUpload,

  StringUtil,
  ArrayUtil,
  NumberUtil,
  ROUND_UP,
  ROUND_DOWN,
  ROUND_CEILING,
  ROUND_FLOOR,
  ROUND_HALF_UP,
  ROUND_HALF_DOWN,
  ROUND_HALF_EVEN,
  ROUND_UNNECESSARY,
};
