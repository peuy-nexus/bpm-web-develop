import Vue from "vue";
import BatchProcessor from "../components/batch-processor/BatchProcessor";
import DialogService from "./DialogService";

class BatchExecute {
  /**
   *  {
   *  action,             // 动作，可选
      actionName,         // 动作名称，必选
      records,            // 执行数组，必选
      recordLabel,        // record 显示 Label，必选
      execute,            // 执行代码，必选
      checkEmpty = true,  // 空数组检查
      confirm = true,     // 执行前确认
    }
   * @param options
   */
  static execute(options) {
    if (Vue.prototype.$isServer) {
      return;
    }

    options = Object.assign(
      {
        checkEmpty: true,
        confirm: true,
        title: `批量执行${options.actionName}`,
      },
      options,
    );

    if (options.checkEmpty && options.records.length === 0) {
      return Vue.prototype.$message({
        type: "error",
        message: `请选择要${options.actionName}的数据`,
      });
    }

    if (options.confirmText) {
      return Vue.prototype
        .$confirm(options.confirmText, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
        .then(() => {
          return DialogService.show(BatchProcessor, options);
        })
        .catch(() => {
          return Promise.resolve();
        });
    } else {
      return DialogService.show(BatchProcessor, options);
    }
  }
}

export default BatchExecute;
export { BatchExecute };
