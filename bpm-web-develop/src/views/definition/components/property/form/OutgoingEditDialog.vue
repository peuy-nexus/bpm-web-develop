<template>
  <el-dialog title="设置任务出口" :visible.sync="visible" class="outgoing-edit-dialog" width="600px">
    <el-form ref="form" :model="formData" :rules="rules">
      <el-alert title="第一个操作将作为流程预测出口；选择业务动作后，执行操作将自动执行业务动作。" type="success">
      </el-alert>
      <el-table class="outgoing-edit-dialog__table" ref="table" :data="rowData" max-height="400">
        <el-table-column prop="name" label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-form-item prop="name" :rules="newOutgoingNameRules(scope.$index)" label-width="0">
              <el-select
                :value="defaultOutgoingKeys.indexOf(scope.row.key) < 0 ? scope.row.name : scope.row.key"
                :maxlength="20"
                placeholder="支持输入自定义操作"
                filterable
                allow-create
                default-first-option
                @change="handleOutgoingChanged(scope.$index, scope.row, $event)"
              >
                <el-option
                  v-for="outgoingKey in defaultOutgoingKeys"
                  :key="outgoingKey"
                  :value="outgoingKey"
                  :label="outgoingKey | outgoingName"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="bizAction" label="应用系统执行" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <el-form-item label-width="0">
              <el-select
                v-model="row.bizAction"
                value-key="uuid"
                placeholder="可选"
                clearable
                @change="handleBizActionChanged($event, row)"
              >
                <el-option v-for="item in bizActions" :key="item.uuid" :value="item" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="moveUpOutgoing(scope.$index)"
              icon="iconfont ic-ui-arrowup"
            ></el-button>
            <el-button
              type="text"
              size="small"
              @click="moveDownOutgoing(scope.$index)"
              icon="iconfont ic-ui-arrowdown"
            ></el-button>
            <el-button
              type="text"
              size="small"
              @click="appendOutgoing(scope.$index)"
              icon="iconfont ic-ui-plus"
            ></el-button>
            <el-button
              :disabled="rowData.length === 1"
              type="text"
              size="small"
              @click="rowData.splice(scope.$index, 1)"
              icon="iconfont ic-ui-minus"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer">
      <el-button @click="controller.cancel()">取消</el-button>
      <el-button type="primary" @click="doConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./OutgoingEditDialog.ts"></script>

<style lang="scss">
.outgoing-edit-dialog {
  &__table {
    margin-top: 20px;
    .el-table__row {
      td {
        padding: 4px 0;
      }
    }
    .el-form-item {
      margin-bottom: 0;
      &.is-error {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
