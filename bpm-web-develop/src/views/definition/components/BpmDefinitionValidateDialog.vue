<template>
  <el-dialog width="600px" :visible.sync="visible">
    <div slot="title">{{ $t("流程中心.流程设计/操作/发布交易/正在校验流程定义") }}<i class="el-icon-loading"></i></div>
    <div class="bpm-definition-validate-result" ref="result">
      <div>
        <el-checkbox>仅显示错误结果</el-checkbox>
      </div>
      <el-table class="outgoing-edit-dialog__table" ref="table" :data="rowData" max-height="400">
        <div slot="empty" class="is-loading">正在校验<i class="el-icon-loading"></i></div>
        <el-table-column prop="text" label="校验内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="result" label="校验结果" width="100px" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>

    <div slot="footer">
      <el-button @click="controller.cancel()">取 消</el-button>
      <el-button :disabled="validating" type="primary" @click="controller.ok()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./BpmDefinitionValidateDialog.ts"></script>

<style lang="scss">
.bpm-definition-validate-result {
}
</style>
