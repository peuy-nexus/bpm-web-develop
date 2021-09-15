/**
 * 缓存管理器
 */
export const storage = {
  getItem: function(key, namespace, defaultValue) {
    if (namespace) {
      key = namespace + "-" + key;
    }
    let value = null;
    if (window.top.java) {
      value = window.top.java.getStorageItem(key);
    } else {
      value = localStorage.getItem(key);
    }
    if (value) {
      return JSON.parse(value);
    } else if (arguments.length === 3) {
      return defaultValue;
    }
    return value;
  },

  setItem: function(key, value, namespace) {
    if (namespace) {
      key = namespace + "-" + key;
    }
    value = JSON.stringify(value);
    if (window.top.java) {
      window.top.java.setStorageItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  },

  clearItem: function(key, namespace) {
    if (namespace) {
      key = namespace + "-" + key;
    }
    if (window.top.java) {
      window.top.java.removeStorageItem(key);
    } else {
      localStorage.removeItem(key);
    }
  },

  clearPreItem: function(key, namespace) {
    if (namespace) {
      key = namespace + "-" + key;
    }
    const teapAry = [];
    for (let i = 0, len = localStorage.length; i < len; i++) {
      teapAry.push(localStorage.key(i));
    }
    for (let i = 0, len = teapAry.length; i < len; i++) {
      const key0 = teapAry[i];
      if (key0 === null || !key0) {
        return;
      }
      if (key0.indexOf(key) !== -1) {
        storage.clearItem(key0);
      }
    }
  },
};

export const sessionStorage = {
  getItem: function(key) {
    const value = window.top.sessionStorage.getItem(key);
    if (value === "undefined") {
      return null;
    }
    if (value) {
      return JSON.parse(value);
    }
    return value;
  },

  setItem: function(key, value) {
    window.top.sessionStorage.setItem(key, JSON.stringify(value));
  },

  clearItem: function(key) {
    window.top.sessionStorage.removeItem(key);
  },
};
export default { storage, sessionStorage };
