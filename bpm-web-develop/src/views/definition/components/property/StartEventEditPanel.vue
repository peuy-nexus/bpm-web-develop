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
          <el-form-item label="表单模块" prop="formModule">
            <resource-module-select
              v-model="formData.formModule"
              @input="handleModuleChanged"
              :placeholder="$t('流程中心.流程设计/选择表单模块')"
            ></resource-module-select>
          </el-form-item>
          <el-form-item label="表单页面" prop="formPage">
            <el-select v-model="formData.formPage" value-key="uuid" @change="handleFormPageChanged">
              <el-option v-for="item in formPages" :key="item.uuid" :value="item" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-table ref="outgoings" :data="formData.formParams" max-height="400px">
            <el-table-column width="100">
              <span slot="header" :title="$t('流程中心.流程定义/页面参数/名称')" class="ellipsis">
                {{ $t("流程中心.流程定义/页面参数/名称") }}
              </span>
              <template slot-scope="{ row }">
                {{ row.name | empty }}
              </template>
            </el-table-column>
            <el-table-column min-width="120" show-overflow-tooltip prop="barcode">
              <span slot="header" :title="$t('流程中心.流程定义/页面参数/参数表达式')" class="ellipsis">
                {{ $t("流程中心.流程定义/页面参数/参数表达式") }}
              </span>
              <template slot-scope="{ row }">
                {{ row.expr | empty }}
              </template>
            </el-table-column>
            <el-table-column width="55" show-overflow-tooltip>
              <span slot="header" :title="$t('公共.表格列/操作')" class="ellipsis">
                {{ $t("公共.表格列/操作") }}
              </span>
              <template slot-scope="{ $index }">
                <el-button type="text" @click="doEditFormParam($index)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </detail-card>
    </el-form>
  </div>
</template>

<script lang="ts" src="./StartEventEditPanel.ts"></script>

<style lang="scss">
.user-task-panel {
  &__form {
    position: relative;
    z-index: 100;
  }

  .end-event {
  }
}
</style>
