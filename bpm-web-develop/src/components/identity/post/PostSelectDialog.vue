<template>
  <el-dialog :title="title" :visible.sync="visible" width="900px" class="el-dialog__height-max">
    <div class="post-select-dialog">
      <div class="post-select-dialog__left">
        <div class="post-select-dialog__left-filter">
          <el-input
            placeholder="请输入关键字查询"
            class="filter-input"
            v-model="filterText"
            clearable
            @clear="loadData()"
            @keydown.enter.native="loadData()"
          ></el-input>
          <el-button type="primary" @click="selectIdentity">查询</el-button>
        </div>
        <div style="flex-grow: 1; overflow: hidden;">
          <el-table ref="table" :data="rowData" height="100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :selectable="skuSelectable"></el-table-column>
            <el-table-column prop="code" label="代码" show-overflow-tooltip min-width="100"></el-table-column>
            <el-table-column prop="name" label="名称" show-overflow-tooltip min-width="150"></el-table-column>
          </el-table>
        </div>
        <el-pagination
          :total="rowTotal"
          :current-page="page"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next"
          @current-change="handleCurrentPageChange"
        />
      </div>
      <div class="post-select-dialog__right">
        <div class="identitys-selected__header">
          <div class="selected__count">
            已选列表：<span class="count">{{ internalSelected.length }}</span>
          </div>
          <el-button type="text" @click="internalSelected = []" v-if="internalSelected.length">清空</el-button>
        </div>
        <div class="identitys-selected__body">
          <div v-if="!internalSelected || internalSelected.length === 0" class="empty-blank-tip small">
            请点击左侧列表选择商
          </div>
          <div class="identitys-selected__body-item" v-for="(item, index) in internalSelected" :key="index">
            <div class="identity__info">{{ item.name }},{{ item.qpc }}&nbsp;[{{ item.code }}]</div>
            <i class="iconfont ic-ui-closethick" @click="internalSelected.splice(index, 1)"></i>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="controller.cancel()">取 消</el-button>
      <el-button type="primary" @click="doConfirm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./PostSelectDialog.ts"></script>
<style lang="scss" scoped>
.post-select-dialog {
  display: flex;
  overflow: hidden;
  height: 100%;

  &__left {
    border: 1px solid $--border-color-base;
    display: flex;
    flex-direction: column;
    flex-shrink: 1;
    flex-grow: 1;
    margin-right: 16px;
    width: 422px;

    &-filter {
      padding: 12px;
      display: flex;

      .filter-input {
        margin-right: 12px;
        width: 264px;
      }
    }

    .el-pagination {
      padding: 12px;
      text-align: right;
    }
  }

  &__right {
    width: 300px;
    flex-shrink: 0;
    border: 1px solid $--border-color-base;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .identitys-selected {
      &__header {
        padding: 12px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid $--border-color-base;

        .selected__count {
          line-height: 32px;
          flex-grow: 1;

          .count {
            color: $--color-primary;
          }
        }
      }

      &__body {
        height: 100%;
        overflow: auto;

        &-item {
          padding: 10px;
          line-height: 20px;
          display: flex;
          align-items: center;

          .identity__info {
            width: 340px;
            flex-grow: 1;
          }

          .delete-btn {
            visibility: hidden;
          }
        }

        &-item {
          .ic-ui-closethick {
            flex-shrink: 0;
            width: 20px;
            height: 20px;
            cursor: pointer;
            visibility: hidden;
          }

          .ic-ui-closethick:hover {
            color: $--color-danger;
          }
        }

        &-item:hover {
          background-color: $--table-row-hover-background-color;

          .ic-ui-closethick {
            visibility: visible;
            color: $--color-text-placeholder;
          }
        }
      }
    }
  }
}
</style>
