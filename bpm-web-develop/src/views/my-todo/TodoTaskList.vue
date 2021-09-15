<template>
  <page-wrapper class="bpm-definition-list">
    <template slot="header">
      <div>{{ $t("流程中心.流程待办/标题") }}</div>
    </template>
    <template slot="body">
      <div class="bpm-definition-list__group">
        <todo-count-tree @change="handleFilterChanged"></todo-count-tree>
      </div>
      <div class="bpm-definition-list__table">
        <query-condition :actions="['search', 'reset']" @search="doSearch" @reset="doReset">
          <el-col :span="12" :lg="8">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程待办/流程ID')" class="ellipsis">
                {{ $t("流程中心.流程待办/流程ID") }}
              </div>
              <el-input
                v-model.trim="filterParams['key:%=%']"
                clearable
                :placeholder="$t('流程中心.流程待办/流程ID/输入提示')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :lg="8">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程待办/流程名称')" class="ellipsis">
                {{ $t("流程中心.流程待办/流程名称") }}
              </div>
              <el-input
                v-model.trim="filterParams['name:%=%']"
                clearable
                :placeholder="$t('流程中心.流程待办/流程名称/输入提示')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :lg="8">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程待办/发起人')" class="ellipsis">
                {{ $t("流程中心.流程待办/发起人") }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" :lg="8">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程待办/发起时间')" class="ellipsis">
                {{ $t("流程中心.流程待办/发起时间") }}
              </div>
              <el-date-picker
                v-model="filterParams['createInfo.time:[,]']"
                type="daterange"
                :start-placeholder="$t('公共.日期范围/开始日期')"
                :end-placeholder="$t('公共.日期范围/结束日期')"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </query-condition>
        <list-view
          ref="listView"
          :row-data="rowData"
          :row-total="rowTotal"
          :default-sort="{ property: 'createInfo.time', direction: 'desc' }"
          @selected="handleSelectRowChange"
          @load="doListLoad"
        >
          <el-table-column fixed="left" min-width="150" show-overflow-tooltip prop="key" :sortable="'custom'">
            <span slot="header" :title="$t('流程中心.流程待办/流程ID')" class="ellipsis">
              {{ $t("流程中心.流程待办/流程ID") }}
            </span>
            <template slot-scope="{ row }">
              <el-link type="primary" :underline="false" @click="doView(row)">{{
                row.bpmInstance.uuid | empty
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column min-width="200" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程待办/流程名称')" class="ellipsis">
              {{ $t("流程中心.流程待办/流程名称") }}
            </span>
            <template slot-scope="{ row }">
              {{ row.bpmInstance.processDefinitionName | empty }}
            </template>
          </el-table-column>
          <el-table-column min-width="180" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程待办/发起模块')" class="ellipsis">
              {{ $t("流程中心.流程待办/发起模块") }}
            </span>
            <template slot-scope="{ row }">
              <span> {{ row.bpmInstance.startModule && row.bpmInstance.startModule.name | empty }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="150" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程待办/发起人')" class="ellipsis">
              {{ $t("流程中心.流程待办/发起人") }}
            </span>
            <template slot-scope="{ row }"> {{ row.bpmInstance.stater | ucn }} </template>
          </el-table-column>
          <el-table-column width="160" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程待办/发起时间')" class="ellipsis">
              {{ $t("流程中心.流程待办/发起时间") }}
            </span>
            <template slot-scope="{ row }"> {{ row.bpmInstance.createInfo.time | datetime }} </template>
          </el-table-column>
          <!--          <el-table-column prop="billCutAmount" :sortable="'custom'" min-width="130" show-overflow-tooltip>-->
          <!--            <span slot="header" :title="$t('流程中心.流程待办/创建信息')" class="ellipsis">-->
          <!--              {{ $t("流程中心.流程待办/创建信息") }}-->
          <!--            </span>-->
          <!--            <template slot-scope="{ row }">{{ row.billCutname }}&nbsp;{{ row.id }} </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column prop="loanAmount" :sortable="'custom'" min-width="130" show-overflow-tooltip>-->
          <!--            <span slot="header" :title="$t('流程中心.流程待办/修改信息')" class="ellipsis">-->
          <!--              {{ $t("流程中心.流程待办/修改信息") }}-->
          <!--            </span>-->
          <!--            <template slot-scope="{ row }">{{ row.loanname }}&nbsp;{{ row.id }}</template>-->
          <!--          </el-table-column>-->
          <el-table-column class-name="table-column__action" width="100" fixed="right">
            <span slot="header" :title="$t('公共.表格列/操作')" class="ellipsis">
              {{ $t("公共.表格列/操作") }}
            </span>
            <template slot-scope="{ row }">
              <el-button @click="doComplete(row)" type="text">{{ $t("公共.操作/去执行") }}</el-button>
              <popover-button @confirm="doClaim(row)" v-if="false">
                <span>{{ $t("公共.操作/签收") }}</span>
                <span slot="tip">{{ $t("公共.操作/签收/提示语") }}</span>
              </popover-button>
            </template>
          </el-table-column>
        </list-view>
      </div>
    </template>
  </page-wrapper>
</template>

<script lang="ts" src="./TodoTaskList.ts"></script>

<style lang="scss" scoped>
.bpm-definition-list {
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
