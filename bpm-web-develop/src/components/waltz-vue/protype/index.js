import NumberUtil from "../utils/NumberUtil";
import { formatDate } from "fant-ui/lib/utils/date-util";

/**
 * 精度
 * @param scale
 * 精度，若不设置，则返回精度
 * @param roundingMode
 * 与scale搭配使用，默认采用const ROUND_HALF_UP
 * @returns {*}
 */
Number.prototype.scale = function(scale, roundingMode) {
  if (arguments.length === 0) {
    return NumberUtil.getScale(this);
  }
  return NumberUtil.setScale(this, scale, roundingMode);
};

/** 加法
 * @param addend
 * 加数
 * @param scale
 * 精度
 * @param roundingMode
 */
Number.prototype.add = function(addend, scale, roundingMode) {
  return NumberUtil.add(this, addend, scale, roundingMode);
};

/**
 * 减法
 * @param subtrahend
 * 减数
 * @param scale
 * 精度
 * @param roundingMode
 */
Number.prototype.subtract = function(subtrahend, scale, roundingMode) {
  return NumberUtil.subtract(this, subtrahend, scale, roundingMode);
};

/**
 * 乘法
 * @param multiplier
 * 乘数
 * @param scale
 * 精度
 * @param roundingMode
 */
Number.prototype.multiply = function(multiplier, scale, roundingMode) {
  return NumberUtil.multiply(this, multiplier, scale, roundingMode);
};

/**
 * 除法
 * @param divisor
 * 除数
 * @param scale
 * 精度
 * @param roundingMode
 */
Number.prototype.divide = function(divisor, scale, roundingMode) {
  return NumberUtil.divide(this, divisor, scale, roundingMode);
};

Date.prototype.toJSON = function() {
  return formatDate(this, "yyyy-MM-dd HH:mm:ss");
};

Date.prototype.format = function(format) {
  return formatDate(this, format);
};

Array.prototype.insert = function(index, ...items) {
  this.splice(index, 0, ...items);
};

Array.prototype.remove = function(...items) {
  for (const item of items) {
    const index = this.indexOf(item);
    if (index > -1) {
      this.splice(index, 1);
    }
  }
};

Array.prototype.removeAt = function(index) {
  if (index > -1) {
    this.splice(index, 1);
  }
};
