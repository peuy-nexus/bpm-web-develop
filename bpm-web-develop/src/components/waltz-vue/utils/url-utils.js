class UrlUtil {
  // 设置指定url中param的值，返回处理后的url
  static setUrlParam = (url, param, value) => {
    let newUrl = "";
    const reg = new RegExp("(^|)" + param + "=([^&]*)(|$)");
    const tmp = param + "=" + value;
    if (url.match(reg) !== null) {
      newUrl = url.replace(reg, tmp);
    } else if (url.match("[?]")) {
      newUrl = url + "&" + tmp;
    } else {
      newUrl = url + "?" + tmp;
    }
    return newUrl;
  };

  // 获取当前窗口url中param参数的值
  static getParam = param => {
    let search = "";
    if (location.hash.match("[?]")) {
      search = location.hash.split("?")[1];
    }
    const query = search.split("&");
    for (let i = 0; i < query.length; i++) {
      const kv = query[i].split("=");
      if (kv[0] === param) {
        return kv[1];
      }
    }
    return null;
  };

  // 设置当前窗口url中param的值
  static setParam = (param, value) => {
    location.href = this.setUrlParam(location.href, param, value);
  };

  // 设置当前窗口url中param的值
  static setParamNoRefresh = (param, value) => {
    const url = UrlUtil.setUrlParam(location.href, param, value);
    history.replaceState("tabChanged", "", url);
  };
}

export default UrlUtil;
export { UrlUtil };
