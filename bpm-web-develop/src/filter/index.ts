import Vue from "vue";
import CommonUtil from "fant-ui/lib/utils/common-util.js";
import { formatDate } from "fant-ui/lib/utils/date-util";

/**
 * 过滤器定制
 */
export default class Filter {
  static init() {
    Vue.filter("operateInfo", (value: any) => {
      if (!value) {
        return "--";
      } else if (!value.operator) {
        return value.time;
      }
      return `${value.operator.fullName}[${value.operator.id}] ${value.time}`;
    });
    Vue.filter("empty", (value: any) => {
      return value || "--";
    });
    Vue.filter("ucn", (value: any) => {
      if (!value || !value.uuid) {
        return "--";
      }
      return `${value.name || "--"}[${value.code || "--"}]`;
    });
    Vue.filter("date", (value: any, format = "yyyy-MM-dd") => {
      if (!value) return "--";
      return formatDate(value, format);
    });
    Vue.filter("datetime", (value: any, format = "yyyy-MM-dd HH:mm:ss") => {
      if (!value) return "--";
      return formatDate(value, format);
    });
    Vue.filter("time", (value: any, format = "HH:mm:ss") => {
      if (!value) return "--";
      return formatDate(value, format);
    });
    Vue.filter("fmt", (value: any, format: string = "0.00") => {
      if (value instanceof Date) {
        return CommonUtil.dateFormat(value, format);
      } else if (typeof value === "number") {
        return CommonUtil.numberFormat(value, format);
      }
      return value || "--";
    });
    Vue.filter("qty", (value: any, format: string = "0.###") => {
      if (value === null || value === undefined || value === "") {
        return "--";
      } else if (typeof value === "number") {
        return CommonUtil.numberFormat(value, format);
      } else {
        const number = Number(value);
        if (!isNaN(number)) {
          return CommonUtil.numberFormat(value, format);
        }
      }
      return value || "--";
    });
    Vue.filter("amount", (value: any, format: string = "0.00") => {
      if (value === null || value === undefined || value === "") {
        return "--";
      } else if (typeof value === "number") {
        return CommonUtil.numberFormat(value, format);
      } else {
        const number = Number(value);
        if (!isNaN(number)) {
          return CommonUtil.numberFormat(value, format);
        }
      }
      return value || "--";
    });
    Vue.filter("price", (value: any, format: string = "0.0000") => {
      if (value === null || value === undefined || value === "") {
        return "--";
      } else if (typeof value === "number") {
        return CommonUtil.numberFormat(value, format);
      } else {
        const number = Number(value);
        if (!isNaN(number)) {
          return CommonUtil.numberFormat(value, format);
        }
      }
      return value || "--";
    });
    Vue.filter("percent", (value: any, format: string = "0.##%") => {
      if (value === null || value === undefined || value === "") {
        return "--";
      } else if (typeof value === "number") {
        value = value * 100;
        return CommonUtil.numberFormat(value, format);
      } else {
        const number = Number(value);
        if (!isNaN(number)) {
          value = value * 100;
          return CommonUtil.numberFormat(value, format);
        }
      }
      return value || "--";
    });
  }
}
