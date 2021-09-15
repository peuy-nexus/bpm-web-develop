import {
  ROUND_UP,
  ROUND_DOWN,
  ROUND_CEILING,
  ROUND_FLOOR,
  ROUND_HALF_UP,
  ROUND_HALF_DOWN,
  ROUND_HALF_EVEN,
  ROUND_UNNECESSARY,
} from "./RoundingMode";

export default class NumberUtil {
  //解决乘法精度丢失问题
  static mul = (arg1, arg2) => {
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) {
      // empty
    }
    try {
      m += s2.split(".")[1].length;
    } catch (e) {
      // empty
    }
    return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
  };

  //解决除法精度问题
  static div = (arg1, arg2) => {
    let t1 = 0;
    let t2 = 0;
    try {
      t1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      // empty
    }
    try {
      t2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      // empty
    }
    const r1 = Number(arg1.toString().replace(".", ""));
    const r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  };

  /**
   * 取得精度
   * @param number
   * @returns {*}
   */
  static getScale = number => {
    let s = String(number);
    s = s.split(".");
    return s[1] ? s[1].length : 0;
  };

  /**
   * 设置精度
   * @param number
   * @param scale
   * @param roundingMode
   * 与scale搭配使用，默认采用const ROUND_HALF_UP
   * @returns {*}
   */
  static setScale = (number, scale, roundingMode) => {
    if (number === undefined || scale === undefined) {
      return number;
    }

    if (roundingMode === undefined) {
      roundingMode = ROUND_HALF_UP;
    }

    number = parseFloat(number);
    scale = parseInt(scale);
    if (scale >= NumberUtil.getScale(number)) {
      return number;
    }
    if (scale < 0) {
      scale = 0;
    }

    roundingMode = parseInt(roundingMode);

    if (roundingMode < ROUND_UP || roundingMode > ROUND_UNNECESSARY) {
      return number;
    }
    if (number === 0) {
      return number;
    }

    const temp = "1" + "0".repeat(scale) - 0;
    if (roundingMode === ROUND_UP) {
      if (number < 0) {
        return Math.floor(NumberUtil.mul(number, temp)) / temp;
      }
      return Math.ceil(NumberUtil.mul(number, temp)) / temp;
    } else if (roundingMode === ROUND_DOWN) {
      if (number > 0) {
        return Math.floor(NumberUtil.mul(number, temp)) / temp;
      }
      return Math.ceil(NumberUtil.mul(number, temp)) / temp;
    } else if (roundingMode === ROUND_CEILING) {
      return Math.ceil(NumberUtil.mul(number, temp)) / temp;
    } else if (roundingMode === ROUND_FLOOR) {
      return Math.floor(NumberUtil.mul(number, temp)) / temp;
    } else if (roundingMode === ROUND_HALF_UP) {
      const string = String(number);
      if (string.indexOf(".") > 0) {
        if (string.charAt(string.indexOf(".") + scale + 1) === "5") {
          // 针对于如1.265的精度舍入问题
          return Math[number > 0 ? "ceil" : "floor"](NumberUtil.mul(number, temp)) / temp;
        }
      }
      return Math.round(NumberUtil.mul(number, temp)) / temp;
    } else if (roundingMode === ROUND_HALF_DOWN) {
      const r = NumberUtil.mul(number, temp);
      if (r - Math.floor(r) > 0.5) {
        return Math.floor(r + 1) / temp;
      }
      return Math.floor(r) / temp;
    } else if (roundingMode === ROUND_HALF_EVEN) {
      return number;
    } else if (roundingMode === ROUND_UNNECESSARY) {
      return number;
    }
  };

  /** 加法
   * @param augend
   * 被加数
   * @param addend
   * 加数
   * @param scale
   * 精度
   * @param roundingMode
   */
  static add = (augend, addend, scale, roundingMode) => {
    if (addend === undefined) {
      addend = 0;
    }
    if (scale === undefined) {
      scale = Math.max(NumberUtil.getScale(augend), NumberUtil.getScale(addend));
    }
    return NumberUtil.setScale(augend + addend, scale, roundingMode);
  };

  /**
   * 减法
   * @param minuend
   * 被减数
   * @param subtrahend
   * 减数
   * @param scale
   * 精度
   * @param roundingMode
   */
  static subtract = (minuend, subtrahend, scale, roundingMode) => {
    if (subtrahend === undefined) {
      subtrahend = 0;
    }
    if (scale === undefined) {
      scale = Math.max(NumberUtil.getScale(minuend), NumberUtil.getScale(subtrahend));
    }
    return NumberUtil.setScale(minuend - subtrahend, scale, roundingMode);
  };

  /**
   * 乘法
   * @param multiplicand
   * 被乘数
   * @param multiplier
   * 乘数
   * @param scale
   * 精度
   * @param roundingMode
   */
  static multiply = (multiplicand, multiplier, scale, roundingMode) => {
    if (multiplicand === 0 || multiplier === undefined || multiplier === 0) {
      return 0;
    }

    if (scale === undefined) {
      scale = multiplicand.scale().add(multiplier.scale());
    }
    return NumberUtil.setScale(NumberUtil.mul(multiplicand, multiplier), scale, roundingMode);
  };

  /**
   * 除法
   * @param dividend
   * 被除数
   * @param divisor
   * 除数
   * @param scale
   * 精度
   * @param roundingMode
   */
  static divide = (dividend, divisor, scale, roundingMode) => {
    if (divisor === undefined) {
      divisor = 0;
    }
    return NumberUtil.setScale(NumberUtil.div(dividend, divisor), scale, roundingMode);
  };
}
