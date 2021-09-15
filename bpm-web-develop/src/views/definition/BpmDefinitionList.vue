<template>
  <page-wrapper class="bpm-definition-list">
    <template slot="header">
      <div>流程列表</div>
      <div>
        <el-button type="primary" @click="doCreateNew" icon="iconfont ic-ui-plus">{{ $t("公共.操作/新建") }}</el-button>
      </div>
    </template>
    <template slot="body">
      <div class="bpm-definition-list__group">
        <bpm-group-tree v-on:currentGroupChanged="currentGroupChanged"></bpm-group-tree>
      </div>
      <div class="bpm-definition-list__table">
        <query-condition :actions="['search', 'reset']" @search="doSearch" @reset="doReset">
          <el-col :span="12" :lg="8" :xl="6">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程定义/流程Key')" class="ellipsis">
                {{ $t("流程中心.流程定义/流程Key") }}
              </div>
              <el-input
                v-model.trim="filterParams['key:=%']"
                clearable
                :placeholder="$t('流程中心.流程定义/流程Key/搜索提示')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :lg="8" :xl="6">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程定义/名称')" class="ellipsis">
                {{ $t("流程中心.流程定义/名称") }}
              </div>
              <el-input
                v-model.trim="filterParams['name:%=%']"
                clearable
                :placeholder="$t('流程中心.流程定义/名称/输入提示')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :lg="8" :xl="6">
            <el-form-item>
              <div slot="label" :title="$t('流程中心.流程定义/状态')" class="ellipsis">
                {{ $t("流程中心.流程定义/状态") }}
              </div>
              <el-select
                v-model="filterParams['state:=']"
                :placeholder="$t('流程中心.流程定义/状态/输入提示')"
                clearable
              >
                <el-option v-for="item in stateOptions" :key="item.value" :value="item.value" :label="item.label">
                </el-option>
              </el-select>
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
            <span slot="header" :title="$t('流程中心.流程定义/流程Key')" class="ellipsis">
              {{ $t("流程中心.流程定义/流程Key") }}
            </span>
            <template slot-scope="{ row }">
              <el-link type="primary" :underline="false" @click="doView(row)">{{ row.key | empty }}</el-link>
            </template>
          </el-table-column>
          <el-table-column min-width="200" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程定义/名称')" class="ellipsis">
              {{ $t("流程中心.流程定义/名称") }}
            </span>
            <template slot-scope="{ row }">
              {{ row.name | empty }}
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
          <el-table-column width="150" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程定义/状态')" class="ellipsis">
              {{ $t("流程中心.流程定义/状态") }}
            </span>
            <template slot-scope="{ row }">
              <span :class="['row-state', `is-${row.state}`]">
                {{ row.state | state }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="description" min-width="250" show-overflow-tooltip>
            <span slot="header" :title="$t('流程中心.流程定义/说明')" class="ellipsis">
              {{ $t("流程中心.流程定义/说明") }}
            </span>
            <template slot-scope="{ row }">{{ row.description | empty }}</template>
          </el-table-column>
          <!--          <el-table-column prop="billCutAmount" :sortable="'custom'" min-width="130" show-overflow-tooltip>-->
          <!--            <span slot="header" :title="$t('流程中心.流程定义/创建信息')" class="ellipsis">-->
          <!--              {{ $t("流程中心.流程定义/创建信息") }}-->
          <!--            </span>-->
          <!--            <template slot-scope="{ row }">{{ row.billCutname }}&nbsp;{{ row.id }} </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column prop="loanAmount" :sortable="'custom'" min-width="130" show-overflow-tooltip>-->
          <!--            <span slot="header" :title="$t('流程中心.流程定义/修改信息')" class="ellipsis">-->
          <!--              {{ $t("流程中心.流程定义/修改信息") }}-->
          <!--            </span>-->
          <!--            <template slot-scope="{ row }">{{ row.loanname }}&nbsp;{{ row.id }}</template>-->
          <!--          </el-table-column>-->
          <el-table-column
            class-name="table-column__action"
            v-if="hasPermission(permission.bpmDefinitionEdit)"
            width="200"
            fixed="right"
          >
            <span slot="header" :title="$t('公共.表格列/操作')" class="ellipsis">
              {{ $t("公共.表格列/操作") }}
            </span>
            <template slot-scope="{ row }">
              <el-button @click="doEdit(row)" type="text">{{ $t("公共.操作/编辑") }}</el-button>
              <popover-button
                @confirm="doEnable(row)"
                v-if="row.state === 'disabled' && hasPermission(permission.bpmDefinitionEnable)"
              >
                <span>{{ $t("公共.操作/启用") }}</span>
                <span slot="tip">{{ $t("公共.操作/启用/提示语") }}</span>
              </popover-button>
              <popover-button
                @confirm="doDisable(row)"
                v-if="row.state === 'enabled' && hasPermission(permission.bpmDefinitionDisable)"
              >
                <span>{{ $t("公共.操作/停用") }}</span>
                <span slot="tip">{{ $t("公共.操作/停用/提示语") }}</span>
              </popover-button>
            </template>
          </el-table-column>
        </list-view>
      </div>
    </template>
  </page-wrapper>
</template>

<script lang="ts" src="./BpmDefinitionList.ts"></script>

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

  .row-state {
    &.is-initial {
      color: #ef821e;
    }
    &.is-enabled {
      color: #58b929;
    }
    &.is-disabled {
      color: #de3232;
    }
  }
}
</style>
