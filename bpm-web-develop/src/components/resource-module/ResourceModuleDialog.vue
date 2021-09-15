<template>
  <el-dialog title="选择模块" width="600px" :visible.sync="visible">
    <el-table
      ref="table"
      :data="rowData"
      @selection-change="handleSelectRowChange"
      max-height="400px"
      class="resource-module__table"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column min-width="80">
        <span slot="header" title="模块名称" class="ellipsis">
          模块名称
        </span>
        <template slot-scope="{ row }">
          {{ row.name | empty }}
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="controller.cancel()">取 消</el-button>
      <el-button type="primary" @click="doConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./ResourceModuleDialog.ts"></script>

<style lang="scss" scoped>
.resource-module__table {
  /deep/ th.el-table-column--selection {
    .cell {
      display: none;
    }
  }
}
</style>
