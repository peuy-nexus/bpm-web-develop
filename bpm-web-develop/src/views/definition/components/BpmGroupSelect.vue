<template>
  <el-select
    ref="select"
    :value="value && value.uuid"
    class="group-tree-select"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    filterable
    :filter-method="filterText"
    @clear="doClearValue"
    @visible-change="handlePopperVisibleChange()"
  >
    <el-option :value="value && value.uuid" :label="value && value.name" class="group-tree-select__option"></el-option>
    <el-tree
      ref="tree"
      :data="treeData"
      :props="treeProps"
      node-key="id"
      :default-expand-all="defaultExpandAll"
      :highlight-current="true"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @current-change="handleCurrentChange"
    >
    </el-tree>
  </el-select>
</template>

<script lang="ts" src="./BpmGroupSelect.ts"></script>

<style lang="scss" scoped>
.group-tree-select__option {
  display: none;
}
</style>
