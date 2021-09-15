<template>
  <div class="user-task-panel">
    <el-form ref="form" class="user-task-panel__form">
      <detail-card title="用户任务" show-tag>
        <template slot="right">
          <el-form-item label="任务名称" prop="name">{{ formData.name }}</el-form-item>
          <el-form-item label="任务出口" prop="outgoings">
            <div>
              {{ formData.outgoings | outgoings }}
            </div>
          </el-form-item>
        </template>
      </detail-card>
      <detail-card title="表单属性" show-tag>
        <template slot="right">
          <el-form-item label="表单模块" prop="formModule">{{ formData.formModule | formModule }}</el-form-item>
          <el-form-item label="表单页面" prop="formPage">{{ formData.formPage | formPage }}</el-form-item>
          <el-table
            ref="formParams"
            :data="formData.formParams"
            max-height="400px"
            v-if="formData.formParams && formData.formParams.length"
          >
            <el-table-column width="100">
              <span slot="header" :title="$t('流程中心.流程定义/页面参数/参数名称')" class="ellipsis">
                {{ $t("流程中心.流程定义/页面参数/参数名称") }}
              </span>
              <template slot-scope="{ row }">
                {{ row.name | empty }}
              </template>
            </el-table-column>
            <el-table-column min-width="120" show-overflow-tooltip prop="barcode">
              <span slot="header" :title="$t('流程中心.流程定义/页面参数/参数取值')" class="ellipsis">
                {{ $t("流程中心.流程定义/页面参数/参数取值") }}
              </span>
              <template slot-scope="{ row }">
                {{ row.expr | empty }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </detail-card>
      <detail-card title="任务候选人列表" show-tag class="user-task-panel__candidates">
        <template slot="right">
          <el-button @click="doAddCandidates" class="user-task-panel__candidates-add" icon="iconfont ic-ui-plus"
            >添加候选人
          </el-button>
          <el-table ref="candidates" :data="formData.candidates" max-height="400px">
            <el-table-column width="60">
              <span slot="header" :title="$t('流程中心.流程定义/身份/类型')" class="ellipsis">
                {{ $t("流程中心.流程定义/身份/类型") }}
              </span>
              <template slot-scope="{ row }">
                {{ row.identityType | identityType }}
              </template>
            </el-table-column>
            <el-table-column min-width="120" show-overflow-tooltip prop="barcode">
              <span slot="header" :title="$t('流程中心.流程定义/任务候选人')" class="ellipsis">
                {{ $t("流程中心.流程定义/任务候选人") }}
              </span>
              <template slot-scope="{ row }">
                {{ row.name | empty }}
              </template>
            </el-table-column>
            <el-table-column width="60" show-overflow-tooltip>
              <span slot="header" :title="$t('公共.表格列/操作')" class="ellipsis">
                {{ $t("公共.表格列/操作") }}
              </span>
              <template slot-scope="{ $index }">
                <popover-button @confirm="doDeleteCandidate($index)">
                  <span>{{ $t("公共.操作/删除") }}</span>
                  <span slot="tip">{{ $t("公共.操作/删除/提示语") }}</span>
                </popover-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </detail-card>
    </el-form>
  </div>
</template>

<script lang="ts" src="./UserTaskPanelViewPanel.ts"></script>

<style lang="scss">
.user-task-panel {
  .user-task-panel__candidates {
    .user-task-panel__candidates-add {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
