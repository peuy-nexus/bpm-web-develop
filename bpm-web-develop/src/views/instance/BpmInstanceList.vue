<template>
  <page-wrapper class="bpm-instance-list">
    <template slot="header">
      <div>{{ $t("流程中心.流程实例/标题") }}</div>
    </template>
    <template slot="body">
      <div class="bpm-instance-list__group">
        <bpm-group-tree v-on:currentGroupChanged="currentGroupChanged"></bpm-group-tree>
      </div>
      <div class="bpm-instance-list__table">
        <query-condition :actions="['search', 'reset']" @search="doSearch" @reset="doReset">
          <el-col :span="12" :lg="8" :xl="6">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程实例/ID')" class="ellipsis">
                {{ $t("流程中心.流程实例/ID") }}
              </div>
              <el-input
                v-model.trim="filterParams['key:=%']"
                clearable
                :placeholder="$t('流程中心.流程实例/ID/输入提示')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :lg="8" :xl="6">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程实例/名称')" class="ellipsis">
                {{ $t("流程中心.流程实例/名称") }}
              </div>
              <el-input
                v-model.trim="filterParams['name:%=%']"
                clearable
                :placeholder="$t('流程中心.流程实例/名称/输入提示')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :lg="8" :xl="6">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程定义/发起模块')" class="ellipsis">
                {{ $t("流程中心.流程定义/发起模块") }}
              </div>
              <wz-search
                v-model="filterObject.startModule"
                @input="filterParams['startModule:='] = $event ? $event.id : null"
                placeholder="请选择"
                clearable
                queryable
                :page-size="50"
                :value-key="`uuid`"
                :value-label="value => `[${value.code}]${value.name}`"
                :query-method="queryStartModule"
                type="record"
              >
              </wz-search>
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
                :query-method="queryStarter"
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
                @input="handleCreateTimeChange"
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
            <span slot="header" :title="$t('流程中心.流程实例/ID')" class="ellipsis">
              {{ $t("流程中心.流程实例/ID") }}
            </span>
            <template slot-scope="{ row }">
              <el-link type="primary" :underline="false" @click="doView(row)">{{ row.key | empty }}</el-link>
            </template>
          </el-table-column>
          <el-table-column min-width="200" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程实例/名称')" class="ellipsis">
              {{ $t("流程中心.流程实例/名称") }}
            </span>
            <template slot-scope="{ row }">
              {{ row.name | empty }}
            </template>
          </el-table-column>
          <el-table-column min-width="180" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程定义/标题')" class="ellipsis">
              {{ $t("流程中心.流程定义/标题") }}
            </span>
            <template slot-scope="{ row }">
              <span> {{ row.processDefinitionName | empty }}</span>
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
          <el-table-column min-width="180" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程实例/发起人')" class="ellipsis">
              {{ $t("流程中心.流程实例/发起人") }}
            </span>
            <template slot-scope="{ row }">
              <span> {{ row.starter && row.starter.name | empty }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="table-column__action" width="200" fixed="right">
            <span slot="header" :title="$t('公共.表格列/操作')" class="ellipsis">
              {{ $t("公共.表格列/操作") }}
            </span>
            <template slot-scope="{ row }">
              <popover-button
                @confirm="doCancel(row)"
                v-if="row.state === 'disabled' && hasPermission(permission.bpmInstanceCancel)"
              >
                <span>{{ $t("公共.操作/终止") }}</span>
                <span slot="tip">{{ $t("流程中心.流程实例/操作/终止/提示语") }}</span>
              </popover-button>
              <popover-button
                @confirm="doDelete(row)"
                v-if="row.state === 'enabled' && hasPermission(permission.bpmInstanceDelete)"
              >
                <span>{{ $t("公共.操作/删除") }}</span>
                <span slot="tip">{{ $t("公共.操作/删除/提示语") }}</span>
              </popover-button>
              <popover-button
                @confirm="doStart(row)"
                v-if="row.state === 'enabled' && hasPermission(permission.bpmInstanceStart)"
              >
                <span>{{ $t("流程中心.流程实例/操作/发起流程") }}</span>
                <span slot="tip">{{ $t("流程中心.流程实例/操作/发起流程/提示语") }}</span>
              </popover-button>
            </template>
          </el-table-column>
        </list-view>
      </div>
    </template>
  </page-wrapper>
</template>

<script lang="ts" src="./BpmInstanceList.ts"></script>

<style lang="scss">
.bpm-instance-list {
  &.page-wrapper {
    .page-body {
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
    overflow: hidden;
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
