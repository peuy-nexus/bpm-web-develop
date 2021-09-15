class Rules {
  // 设置指定url中param的值，返回处理后的url
  static createValidator = fn => {
    return (rule, value, callback) => {
      try {
        fn(rule, value);
        callback();
      } catch (e) {
        callback(e);
      }
    };
  };
}

export default Rules;
export { Rules };
