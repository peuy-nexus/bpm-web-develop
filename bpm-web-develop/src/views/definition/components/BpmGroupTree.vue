<template>
  <div class="bpm-group-tree">
    <div class="bpm-group-tree__header">
      <el-input
        v-model="filterText"
        placeholder="流程分组"
        clearable
        @clear="doTreeFilter"
        @keydown.enter.native="doTreeFilter"
      ></el-input>
      <el-button @click="doCreateNew">{{ $t("公共.操作/新建") }}</el-button>
    </div>
    <el-tree
      class="bpm-group-tree__body"
      ref="tree"
      :data="treeData"
      :props="treeProps"
      node-key="uuid"
      default-expand-all
      :expand-on-click-node="false"
      :highlight-current="true"
      :filter-node-method="filterNode"
      @current-change="handleCurrentChange"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
    >
      <div class="bpm-group-tree__row" slot-scope="{ node, data }">
        <div class="bpm-group-tree__row-name">{{ data.name }}</div>
        <div
          class="bpm-group-tree__row-action"
          v-if="hasPermission(permission.bpmGroupModify) && data.uuid && data.uuid !== '-'"
        >
          <popover-button @confirm="doDelete(data)" v-if="hasPermission(permission.bpmGroupModify) && data.uuid">
            <span>{{ $t("公共.操作/删除") }}</span>
            <span slot="tip">{{ $t("公共.操作/删除/提示语") }}</span>
          </popover-button>

          <el-button type="text" @click="doEdit(data, node, $event)">编辑</el-button>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script lang="ts" src="./BpmGroupTree.ts"></script>

<style lang="scss">
.bpm-group-tree {
  &__header {
    display: flex;
    padding: 12px 0;
    background: $--color-white;
    position: sticky;
    top: 0;
    z-index: 1;

    > .el-input {
      flex-grow: 1;
      flex-shrink: 1;
    }

    > .el-button {
      flex-shrink: 0;
      margin-left: 12px;
    }
  }

  &__row {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;

    &-name {
      flex-grow: 1;
      flex-shrink: 1;
    }

    &-action {
      display: none;
      width: 80px;
      flex-shrink: 0;
      flex-grow: 0;
      text-align: right;
      padding-right: 12px;
    }

    &:hover {
      .bpm-group-tree__row-action {
        display: block;
      }
    }
  }

  &__body {
    padding-bottom: 20px;
    > .el-tree-node {
      > .el-tree-node__content {
        &::before {
          content: "";
        }
      }
    }
  }
  .el-tree-node__content {
    &:hover {
      &::before {
        display: inline-block;
      }
    }
    &::before {
      content: "\e79c";
      font-family: "iconfont" !important;
      display: none;
      speak: none;
      font-size: 18px;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      vertical-align: baseline;
      -webkit-font-smoothing: antialiased;
      position: absolute;
      left: 0;
    }
  }
}
</style>
