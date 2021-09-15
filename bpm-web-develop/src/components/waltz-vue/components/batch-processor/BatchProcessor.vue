<template>
  <el-dialog
    class="batch-processor"
    title="批量删除"
    :visible.sync="visible"
    width="800px"
    :show-close="false"
    :close-on-press-escape="false"
  >
    <div slot="title">{{ title }}<span v-if="finished"> —— 执行结果</span></div>

    <div class="batch-processor-panel" v-if="!finished">
      <div class="batch-processor-label">当前正在处理：{{ currentLabel }}</div>
      <div class="batch-processor-bar">
        <el-progress :text-inside="true" :stroke-width="26" :percentage="schedulePercent"></el-progress>
      </div>
    </div>

    <div class="batch-processor-result" v-if="finished">
      <div class="batch-processor-result-summary">
        <span>共</span>
        <span class="primary-color"> {{ result.length }} </span>
        <span>。 其中 成功：</span>
        <span class="success-color"> {{ successCount }} </span>
        <span>； 忽略：</span>
        <span class="text-secondary-color"> {{ ignoreCount }} </span>
        <span>； 失败：</span>
        <span class="danger-color">{{ failureCount }} </span>
        <span>。</span>
      </div>
      <div style="height: 400px">
        <el-table :data="result" max-height="400">
          <el-table-column label="行号" type="index"></el-table-column>
          <el-table-column property="recordLabel" label="概要"> </el-table-column>
          <el-table-column label="执行结果">
            <template slot-scope="scope">
              <span :class="['status']">{{ getStatus(scope.row.status) }}</span>
              <!-- 颜色-->
            </template>
          </el-table-column>
          <el-table-column property="message" label="说明"> </el-table-column>
        </el-table>
      </div>
    </div>

    <div slot="footer">
      <el-button v-if="finished" type="primary" @click="controller.close()">确定</el-button>
      <el-button v-if="!finished" @click="interrupt">中 断</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "BatchProcessor",
  props: {
    visible: Boolean,
    action: String,
    title: String,
    records: Array,
    execute: {
      type: Function,
    },
    recordLabel: {
      type: Function,
    },
  },
  data() {
    return {
      result: [],
      running: false,
      finished: false,
      currentLabel: "",
      interrupting: false,
      currentIndex: 0,
      successCount: 0,
      ignoreCount: 0,
      failureCount: 0,
      gridOptions: {
        columnDefs: [
          { headerName: "行号", field: "lineNo", width: 80, valueGetter: params => params.node.rowIndex + 1 },
          { headerName: "概要", field: "recordLabel", minWidth: 120, flex: 120 },
          // { headerName: "执行结果", field: "status", width: 100, cellRenderer: statusCellRenderer },
          { headerName: "说明", field: "message", minWidth: 240, flex: 240, tooltipField: "message" },
        ],
      },
    };
  },
  computed: {
    schedulePercent() {
      const count = this.records ? this.records.length : 0;
      if (count) {
        return ((this.currentIndex / count) * 100).scale(0);
      }
      return 0;
    },
  },
  mounted() {
    this.result = [];
    if (this.records && this.execute) {
      this.running = true;
      this.executeOne(0);
    }
  },
  methods: {
    executeOne(index) {
      const { interrupting, running } = this;
      if (interrupting) {
        return;
      }
      if (running === false || index === this.records.length) {
        return this.endBatch();
      }

      this.currentIndex = index;
      const record = this.records[index];
      if (record) {
        this.currentLabel = this.recordLabel(record);
        this.currentExecute = this.execute({ index, record, action: this.action });
        this.currentExecute
          .then(response => {
            this.currentExecute = null;
            this.appendResult(index, record, response);
            this.executeOne(index + 1);
          })
          .catch(error => {
            if (error && error.__proto__.__CANCEL__ === true) {
              return;
            }

            const fn = message => {
              this.appendResult(index, record, {
                success: false,
                message,
              });
              this.executeOne(index + 1);
            };

            if (error === undefined || error === null) {
              fn(error);
            } else if (typeof error === "string") {
              fn(error);
            } else {
              fn(`${error}`);
            }
          });
      }
    },

    interrupt() {
      if (this.running === false) {
        return;
      }

      this.interrupting = true;
      this.$confirm("确定要终止批量操作吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.interrupting = false;
          this.running = false;
          if (this.currentExecute) {
            this.currentExecute.cancel();
            this.endBatch(true);
          } else {
            this.executeOne(this.currentIndex);
          }
        })
        .catch(res => {
          this.interrupting = false;
          this.executeOne(this.currentIndex);
        });
    },

    endBatch(interrupted) {
      this.running = false;
      if (interrupted === true) {
        this.result.push({
          index: this.currentIndex,
          record: this.records[this.currentIndex],
          recordLabel: this.recordLabel(this.records[this.currentIndex]),
          status: "interrupted",
          message: "请求已发出，但是被中断",
        });
      }

      const unExecutes = [];
      for (let i = this.result.length; i < this.records.length; i++) {
        unExecutes.push({
          index: i,
          record: this.records[i],
          recordLabel: this.recordLabel(this.records[i]),
          status: "ignore",
          message: "未处理",
        });
      }
      this.result.push(...unExecutes);

      this.successCount = 0;
      this.ignoreCount = 0;
      this.failureCount = 0;
      this.result.forEach(item => {
        this[`${item.status}Count`]++;
      });
      this.finished = true;
    },

    appendResult(index, record, response) {
      let status;
      if (response === undefined || response === null) {
        status = "ignore";
      } else if (response.success === "ignore") {
        status = "ignore";
      } else if (!response.success) {
        status = "failure";
      } else {
        status = "success";
      }

      this.result.push({
        index: index,
        record: record,
        recordLabel: this.recordLabel(record),
        status: status,
        message: response && response.message,
      });
    },

    getStatus(value) {
      if (value === "success") {
        return "成功";
      } else if (value === "ignore") {
        return "忽略";
      } else if (value === "interrupted") {
        return "中断";
      } else if (value === "failure") {
        return "失败";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.batch-processor {
  &-label {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
  }

  &-bar {
    padding: 10px 0;
  }

  &-result-summary {
    padding-bottom: 10px;
    font-size: 16px;
  }
}
</style>
