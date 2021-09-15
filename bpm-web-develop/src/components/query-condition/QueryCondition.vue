<template>
  <el-form label-width="78px" ref="queryCondition" class="query-condition" @keydown.native="bindFastCode">
    <el-row
      ref="row"
      :class="{
        'query-condition__row': true,
        'is-togglable': togglable,
        'is-opened': opened,
      }"
      :style="{
        'max-height': opened && $refs.row ? `${$refs.row.$el.scrollHeight}px` : '88px',
      }"
    >
      <slot></slot>
      <el-col
        ref="action"
        :span="togglable ? 24 : 12"
        :xl="togglable ? 24 : 6"
        :lg="togglable ? 24 : 8"
        v-if="actions.length"
        class="query-condition__action"
        :style="{
          'padding-left': togglable ? '78px' : '20px',
        }"
      >
        <el-button type="primary" @click="doSearch" v-if="actions.indexOf('search') !== -1">{{
          $t("公共.查询/搜索按钮")
        }}</el-button>
        <el-button @click="doReset" v-if="actions.indexOf('reset') !== -1">{{
          $t("公共.查询/清空筛选按钮")
        }}</el-button>
        <el-button @click="doExport" v-if="actions.indexOf('export') !== -1">{{
          $t("公共.查询/导出查询结果")
        }}</el-button>
        <el-button type="text" v-if="showToggle && opened" @click="doToggle" icon="el-icon-arrow-up">
          {{ $t("公共.查询/收起") }}
        </el-button>
        <el-button type="text" v-if="showToggle && !opened" @click="doToggle" icon="el-icon-arrow-down">
          {{ $t("公共.查询/展开") }}
        </el-button>
      </el-col>
      <slot name="append"></slot>
    </el-row>
  </el-form>
</template>

<script lang="ts" src="./QueryCondition.ts"></script>

<style lang="scss" scoped>
.query-condition {
  padding: 0;
  margin-bottom: -12px;
  flex-shrink: 0;

  &__row {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
    transition: max-height 0.1s ease-out;

    /deep/ .query-condition__action {
      box-sizing: border-box;
      margin-bottom: 12px;
      background-color: $--color-white;
    }

    /deep/ .el-input {
      width: 100%;
    }

    /deep/ .el-select {
      width: 100%;
    }

    &.is-togglable {
      padding-bottom: 44px;
      /deep/ .query-condition__action {
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }
}
</style>
