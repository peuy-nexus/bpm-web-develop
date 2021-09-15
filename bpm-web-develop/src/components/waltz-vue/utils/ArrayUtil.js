export default class ArrayUtil {
  static inArray(source, target) {
    for (let s = 0; s < target.length; s++) {
      const thisEntry = target[s].toString();
      if (thisEntry === source) {
        return true;
      }
    }
    return false;
  }

  /**
   * 将source数组中的数据填充到target数组
   * @param source
   * @param target
   */
  static fill(source, target) {
    if (source && target && Array.isArray(source) && Array.isArray(target)) {
      source.forEach(item => {
        target.push(item);
      });
    }
  }

  static idList(array, field) {
    if (!array || !field || !Array.isArray(array)) {
      return;
    }

    const idList = [],
      params = field.split(".");

    array.forEach(item => {
      let value;
      for (let i = 0; i < params.length; i++) {
        value = item[params[i]];
      }

      idList.push(value);
    });

    return idList;
  }

  /**
   */
  static idMap(array, field) {
    if (!array || !field || !Array.isArray(array)) {
      return;
    }

    const idMap = [],
      params = field.split(".");

    array.forEach(item => {
      let value;
      for (let i = 0; i < params.length; i++) {
        value = item[params[i]];
      }

      idMap[value] = item;
    });
    return idMap;
  }

  /**
   *  筛，筛选，过滤。
   *  将数组中（fn=true）的item删除。
   *  注意，该方法直接作用于原数组上。
   */
  static remove(array, fn, scope) {
    if (!array || !Array.isArray(array)) {
      return;
    }

    for (let i = 0; i < array.length; i++) {
      if (fn.call(scope, array[i], i, array)) {
        array.splice(i--, 1);
      }
    }
  }

  /**
   *  筛，筛选，过滤。
   *  将数组中（fn=false）的item删除。
   *  注意，该方法直接作用于原数组上。
   */
  static sieve(array, fn, scope) {
    if (!array || !Array.isArray(array)) {
      return;
    }

    for (let i = 0; i < array.length; i++) {
      if (!fn.call(scope, array[i], i, array)) {
        array.splice(i--, 1);
      }
    }
  }

  static list2String = function(array, separator, escape) {
    if (!array || !Array.isArray(array)) {
      return array;
    }

    separator = separator || ";";
    escape = escape || "\\";
    if (separator === escape) {
      return;
    }

    const DEFAULT_NULL = "~",
      out = [],
      encode = function(out, input, escape, reservedChars) {
        let i = 0,
          argIdx;
        for (; i < input.length; i++) {
          const c = input.charAt(i);
          let reserved;
          if (c === escape) {
            out.push(escape);
          } else {
            reserved = false;
            argIdx = 3;
            // 这边的估计是有bug的？
            for (; argIdx < array.length; argIdx++) {
              if (array[argIdx] === c) {
                reserved = true;
                break;
              }
            }
            if (reserved) {
              out.push(escape);
            }
          }
          out.push(c);
        }
      };
    array.forEach(item => {
      if (out.length > 0) {
        out.push(separator);
      }
      if (item === null) {
        out.push(DEFAULT_NULL);
      } else {
        encode(out, String(item), escape, separator, DEFAULT_NULL);
      }
    });
    return out.join("");
  };

  static string2List = function(input, separator, escape) {
    if (input === null || input === undefined) {
      return null;
    }
    separator = separator || ";";
    escape = escape || "\\";
    if (separator === escape) {
      return;
    }

    const DEFAULT_NULL = "~";
    const list = [];
    const word = [];
    let escapeOn = false;
    let i = 0;
    for (; i < input.length; i++) {
      const c = input.charAt(i);
      if (c === escape) {
        if (escapeOn) {
          word.push(escape);
          escapeOn = false;
        } else {
          escapeOn = true;
        }
      } else if (c === DEFAULT_NULL) {
        if (escapeOn) {
          word.push(DEFAULT_NULL);
          escapeOn = false;
        } else {
          word.push(DEFAULT_NULL);
        }
      } else if (c === separator) {
        if (escapeOn) {
          word.push(separator);
          escapeOn = false;
        } else {
          list.push(word.join(""));
          word.length = 0;
        }
      } else {
        word.push(c);
      }
    }
    if (word.length > 0) {
      list.push(word.join(""));
    }
    return list;
  };
}
