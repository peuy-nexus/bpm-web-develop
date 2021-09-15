<template>
  <page-wrapper class="my-joined-list">
    <template slot="header">
      <div>{{ $t("流程中心.我参与的/标题") }}</div>
    </template>
    <template slot="body">
      <div class="my-joined-list__table">
        <query-condition :actions="['search', 'reset']" @search="doSearch" @reset="doReset">
          <el-col :span="12" :lg="8" :xl="6">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程定义/ID')" class="ellipsis">
                {{ $t("流程中心.流程定义/ID") }}
              </div>
              <el-input
                v-model.trim="filterParams['processDefinitionKey:=%']"
                clearable
                :placeholder="$t('流程中心.流程定义/ID/输入提示')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :lg="8" :xl="6">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程定义/名称')" class="ellipsis">
                {{ $t("流程中心.流程定义/名称") }}
              </div>
              <el-input
                v-model.trim="filterParams['processDefinitionName:%=%']"
                clearable
                :placeholder="$t('流程中心.流程定义/名称/输入提示')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :lg="8" :xl="6">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程实例/发起人')" class="ellipsis">
                {{ $t("流程中心.流程实例/发起人") }}
              </div>
              <wz-search
                v-model="filterObject.starter"
                @input="filterParams['starter:='] = $event ? $event.id : null"
                placeholder="请选择"
                clearable
                queryable
                :page-size="50"
                :value-key="`uuid`"
                :value-label="value => `[${value.code}]${value.name}`"
                :query-method="queryStarted"
                type="record"
              >
              </wz-search>
            </el-form-item>
          </el-col>
          <el-col :span="12" :lg="8" :xl="6">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程实例/发起时间')" class="ellipsis">
                {{ $t("流程中心.流程实例/发起时间") }}
              </div>
              <el-date-picker
                v-model="filterParams['createTime:[,]']"
                type="daterange"
                range-separator="-"
                :start-placeholder="$t('公共.公共/查询/开始日期/输入提示')"
                :end-placeholder="$t('公共.公共/查询/结束日期/输入提示')"
                :editable="false"
                clearable
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </query-condition>
        <list-view
          ref="listView"
          :row-data="rowData"
          :row-total="rowTotal"
          @selected="handleSelectRowChange"
          @load="doListLoad"
          :default-sort="{ property: 'key_order', direction: 'desc' }"
        >
          <el-table-column fixed="left" min-width="150" show-overflow-tooltip prop="key" :sortable="'custom'">
            <span slot="header" :title="$t('流程中心.流程定义/ID')" class="ellipsis">
              {{ $t("流程中心.流程定义/ID") }}
            </span>
            <template slot-scope="{ row }">
              <el-link type="primary" :underline="false" @click="doView(row)">{{
                row.processDefinitionKey | empty
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column min-width="200" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程定义/名称')" class="ellipsis">
              {{ $t("流程中心.流程定义/名称") }}
            </span>
            <template slot-scope="{ row }">
              {{ row.processDefinitionName | empty }}
            </template>
          </el-table-column>
          <el-table-column min-width="180" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程定义/发起模块')" class="ellipsis">
              {{ $t("流程中心.流程定义/发起模块") }}
            </span>
            <template slot-scope="{ row }">
              <span> {{ row.startModule && row.startModule.name | empty }}</span>
            </template>
          </el-table-column>
        </list-view>
      </div>
    </template>
  </page-wrapper>
</template>

<script lang="ts" src="./JoinedTaskList.ts"></script>

<style lang="scss" scoped>
.my-joined-list {
  &.page-wrapper {
    /deep/ .page-body {
      flex-direction: row;
      overflow: hidden;
      padding: 0;
    }
  }

  &__group {
    width: 320px;
    flex-shrink: 0;
    flex-grow: 0;
    border-right: $--border-base;
    padding: 0 32px;
    overflow: auto;
    position: relative;
  }

  &__table {
    flex-grow: 1;
    padding: 20px 32px;
  }

  .bill-list-state {
    &-initial {
      color: #ef821e;
    }
    &-enabled {
      color: #58b929;
    }
    &-disabled {
      color: #de3232;
    }
  }
}
</style>
