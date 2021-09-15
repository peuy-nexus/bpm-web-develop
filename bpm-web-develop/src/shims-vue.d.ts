declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare type Nullable<T> = T | null; // 空
declare module "fant-ui";
declare module "lodash";
declare module "mockjs";
declare module "sortablejs";
declare module "wangeditor";
declare module "xml-js";
declare module "bpmn-js/lib/Modeler";
declare module "bpmn-js/lib/NavigatedViewer";
declare module "throttle-debounce/debounce";
declare module "fant-ui/lib/locale";
declare module "fant-ui/lib/utils/util.js";
declare module "fant-ui/lib/utils/date-util";
declare module "fant-ui/lib/utils/common-util.js";
declare module "fant-ui/lib/utils/resize-event";
declare module "fant-ui/lib/utils/clickoutside";
declare module "vue-i18n";
// declare module "locale";

interface Number {
  scale(scale: number): number;
  scale(scale: number, roundingMode: number): number;

  add(addend: number): number;
  add(addend: number, scale: number): number;
  add(addend: number, scale: number, roundingMode: number): number;

  subtract(subtrahend: number): number;
  subtract(subtrahend: number, scale: number): number;
  subtract(subtrahend: number, scale: number, roundingMode: number): number;

  multiply(multiplier: number): number;
  multiply(multiplier: number, scale: number): number;
  multiply(multiplier: number, scale: number, roundingMode: number): number;

  divide(divisor: number): number;
  divide(divisor: number, scale: number): number;
  divide(divisor: number, scale: number, roundingMode: number): number;
}
