export default class StringUtil {
  /**生成一个UUID*/
  static uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  static toBool = value => {
    if (value === "") {
      return true;
    } else if (value === "false") {
      return false;
    }
    return Boolean(value);
  };

  /**
   * 将 value 转换为数值。当结果为NaN时，返回 defaultValue
   * @param value
   * @param defaultValue  默认值
   * @returns {*}
   */
  static toNumber = function(value, defaultValue) {
    if (typeof value === "string") {
      value = Number(value);
    }
    if (Number.isNaN(value)) {
      value = defaultValue;
    }
    return value;
  };
}
