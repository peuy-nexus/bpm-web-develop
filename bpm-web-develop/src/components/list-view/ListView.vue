<template>
  <div class="list-view" ref="listView">
    <div v-if="selectable" class="toolbar list-view__action" ref="actions">
      <div class="selected-btn" type="info" :closable="false">
        <span>{{ $t("公共.查询/已选中") }}</span>
        <span class="list-view__selected-count">{{ internalSelected.length }}</span>
        <span>{{ $t("公共.查询/行") }}</span>
        <el-button v-if="internalSelected.length" type="text" size="small" @click="clearSelection()"
          >{{ $t("公共.查询/取消选中") }}
        </el-button>
      </div>
      <slot name="actions" :selected="internalSelected"></slot>
      <div class="icons">
        <slot name="icons"></slot>
      </div>
    </div>
    <div v-if="!selectable" style="justify-content:space-between" class="toolbar list-view__action" ref="actions">
      <div></div>
      <slot name="actions" v-if="!selectable" :selected="internalSelected"></slot>
    </div>
    <el-table
      ref="table"
      :data="rowData"
      :row-key="rowKey"
      @row-click="doRowClick"
      :stripe="stripe"
      :show-header="showHeader"
      :emptyText="emptyText"
      :height="height"
      :default-sort="internalDefaultSort"
      @selection-change="doSelectionChange"
      @sort-change="doSortChange"
      :max-height="maxHeight"
    >
      <el-table-column
        v-if="selectable"
        type="selection"
        :selectable="checkSelectable"
        :reserve-selection="reserveSelection"
      ></el-table-column>
      <slot></slot>
      <div slot="empty" class="empty-blank-tip small">
        <div>{{ $t("公共.列表无数据/提示") }}</div>
      </div>
    </el-table>
    <div class="list-view__paging" ref="paging">
      <div class="list-view__paging-count">{{ $t("公共.分页控件/数据统计", { "0": rowTotal }) }}</div>
      <el-pagination
        :layout="layout"
        v-if="pageable"
        :total="rowTotal"
        :current-page="internalPage"
        :page-size="queryParam.pageSize"
        @current-change="doPageChange"
      >
        <el-select class="list-view__page-size" :value="queryParam.pageSize" @input="doSizeChange">
          <template v-for="pageSize in pageSizes">
            <el-option
              :value="pageSize"
              :key="pageSize"
              :label="$t('公共.分页控件/每页显示行', { '0': pageSize })"
            ></el-option>
          </template>
        </el-select>
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" src="./ListView.ts"></script>

<style lang="scss" scoped>
/*缺省提示*/
.empty-tip {
  line-height: initial;
  text-align: center;
  color: #999999;
  font-size: 14px;
  padding-top: 20px;
  padding-bottom: 20px;

  .ic-empty {
    width: 90px;
    /*margin-bottom: 15px;*/
  }
}

/* 分页器 */
.custom-jump-page {
  color: #79879e;
  font-size: 12px;
  font-weight: initial;
  display: inline-block;
  margin-left: 8px;

  .el-input {
    width: 88px;
  }

  .el-input--mini .el-input__inner {
    padding: 0 3px;
  }
}

/deep/ .el-pagination__total {
  color: #79879e;
  font-size: 12px;
}

/deep/ .el-pager li {
  color: #1f375d;
  font-size: 12px;
}

/deep/ .el-pagination .el-select .el-input .el-input__inner {
  color: #1f375d;
  font-size: 12px;
  border: 1px solid #d7dfeb;
}

/deep/ .el-pagination .btn-prev {
  margin-left: 10px;
}

/deep/ .el-pagination .btn-next {
  margin-right: 10px;
}

.list-view {
  height: 100%;

  .toolbar {
    display: flex;
    align-items: center;
    padding-bottom: 12px;
  }

  .pagination-jumper {
    color: $--color-text-secondary;
    margin-left: 12px;

    &__input {
      width: 40px;
      margin: 0 8px;
    }
  }

  .selected-btn {
    flex: 0 0 auto;
    color: #4c5f7d;
    width: auto;
    display: inline-block;
    margin-right: 10px;
    padding: 4px 12px 4px 0;
    font-size: $--button-small-font-size;

    /deep/ .el-button--text {
      padding: 0;
      margin-left: 5px;
    }
  }

  &__selected-count {
    color: $--color-primary;
    margin: 0 5px;
  }

  &__paging {
    height: 56px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    &-count {
      color: $--color-text-placeholder;
      text-align: right;
    }

    /deep/ .el-pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .list-view__page-size.el-select {
        .el-input {
          min-width: 106px;
        }
      }
    }
  }
}
</style>
