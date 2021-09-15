<template>
  <div class="user-task-panel">
    <el-form ref="form" :model="formData" class="user-task-panel__form">
      <detail-card class="end-event" title="起点" show-tag>
        <template slot="right">
          <el-form>
            <el-form-item label="说明">流程的起点</el-form-item>
          </el-form>
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
    </el-form>
  </div>
</template>

<script lang="ts" src="./StartEventViewPanel.ts"></script>

<style lang="scss" scoped>
.user-task-panel {
  &__form {
    position: relative;
    z-index: 100;
  }

  .end-event {
  }
}
</style>
