<template>
  <div class="todo-count-tree">
    <div class="todo-count-tree__header">
      <el-input
        v-model="filterText"
        placeholder="请输入"
        clearable
        @clear="doTreeFilter"
        @keydown.enter.native="doTreeFilter"
      ></el-input>
    </div>
    <el-tree
      class="todo-count-tree__body"
      ref="tree"
      :data="treeData"
      :props="treeProps"
      node-key="uuid"
      default-expand-all
      :expand-on-click-node="false"
      :highlight-current="true"
      :filter-node-method="filterNode"
      @current-change="handleCurrentChange"
    >
      <div class="todo-count-tree__row" slot-scope="{ node, data }">
        <div class="todo-count-tree__row-name">{{ data.name }}</div>
        <div class="todo-count-tree__row-total-count">{{ data.totalCount }}</div>
      </div>
    </el-tree>
  </div>
</template>

<script lang="ts" src="./TodoCountTree.ts"></script>

<style lang="scss">
.todo-count-tree {
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
    &-total-count {
      padding: 0 12px;
    }
  }

  &__body {
    padding-bottom: 20px;
  }
}
</style>
