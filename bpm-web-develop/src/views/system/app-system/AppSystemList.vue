<template>
  <page-wrapper class="app-system-list">
    <template slot="header">
      <div>{{ $t("流程中心.系统管理/应用系统/标题") }}</div>
      <div>
        <el-button type="primary" @click="doCreateNew" icon="iconfont ic-ui-plus">{{ $t("公共.操作/新建") }}</el-button>
      </div>
    </template>
    <template slot="body">
      <query-condition :actions="['search', 'reset']" @search="doSearch" @reset="doReset">
        <el-col :span="12" :lg="8" :xl="6">
          <el-form-item>
            <div slot="label" :title="$t('流程中心.系统管理/应用系统/代码')" class="ellipsis">
              {{ $t("流程中心.系统管理/应用系统/代码") }}
            </div>
            <el-input
              v-model.trim="filterParams['code:%=%']"
              clearable
              :placeholder="$t('流程中心.系统管理/应用系统/代码/输入提示')"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12" :lg="8" :xl="6">
          <el-form-item>
            <div slot="label" :title="$t('流程中心.系统管理/应用系统/名称')" class="ellipsis">
              {{ $t("流程中心.系统管理/应用系统/名称") }}
            </div>
            <el-input
              v-model.trim="filterParams['name:%=%']"
              clearable
              :placeholder="$t('流程中心.系统管理/应用系统/名称/输入提示')"
            />
          </el-form-item>
        </el-col>
      </query-condition>
      <list-view
        ref="listView"
        :row-data="rowData"
        :row-total="rowTotal"
        row-key="uuid"
        @selected="handleSelectRowChange"
        @load="doListLoad"
        :default-sort="{ property: 'key', direction: 'desc' }"
      >
        <el-table-column fixed="left" min-width="160" show-overflow-tooltip prop="key" :sortable="'custom'">
          <span slot="header" :title="$t('流程中心.系统管理/应用系统/代码')" class="ellipsis">
            {{ $t("流程中心.系统管理/应用系统/代码") }}
          </span>
          <template slot-scope="{ row }">{{ row.code | empty }}</template>
        </el-table-column>
        <el-table-column min-width="200" show-overflow-tooltip>
          <span slot="header" :title="$t('流程中心.系统管理/应用系统/名称')" class="ellipsis">
            {{ $t("流程中心.系统管理/应用系统/名称") }}
          </span>
          <template slot-scope="{ row }">
            {{ row.name | empty }}
          </template>
        </el-table-column>
        <el-table-column min-width="120" show-overflow-tooltip>
          <span slot="header" :title="$t('流程中心.系统管理/应用系统/组织控制')" class="ellipsis">
            {{ $t("流程中心.系统管理/应用系统/组织控制") }}
          </span>
          <template slot-scope="{ row }">
            {{ row.orgScope | empty }}
          </template>
        </el-table-column>
        <el-table-column min-width="240" show-overflow-tooltip>
          <span slot="header" :title="$t('流程中心.系统管理/应用系统/说明')" class="ellipsis">
            {{ $t("流程中心.系统管理/应用系统/说明") }}
          </span>
          <template slot-scope="{ row }">
            {{ row.remark | empty }}
          </template>
        </el-table-column>
        <el-table-column
          class-name="table-column__action"
          v-if="hasPermission(permission.bpmAppSystemModify)"
          width="200"
          fixed="right"
        >
          <span slot="header" :title="$t('公共.表格列/操作')" class="ellipsis">
            {{ $t("公共.表格列/操作") }}
          </span>
<!--          -->
          <template slot-scope="{ row }">
            <el-button @click="doEdit(row)"  type="text">{{ $t("公共.操作/编辑") }}</el-button>
            <popover-button @confirm="doDelete(row)" v-if="hasPermission(permission.bpmAppSystemDelete)">
              <span>{{ $t("公共.操作/删除") }}</span>
              <span slot="tip">{{ $t("公共.操作/删除/提示语") }}</span>
            </popover-button>
          </template>
<!--          -->
        </el-table-column>
      </list-view>
    </template>
  </page-wrapper>
</template>

<script lang="ts" src="./AppSystemList.ts">
</script>

<style lang="scss"></style>
