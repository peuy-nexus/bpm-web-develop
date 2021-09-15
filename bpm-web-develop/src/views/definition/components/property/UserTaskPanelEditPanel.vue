<template>
  <div class="user-task-panel">
    <div class="user-task-panel__mask" v-if="!formData.name" @click="showError"></div>
    <el-form ref="form" :model="formData" :rules="rules" class="user-task-panel__form">
      <detail-card title="用户任务" show-tag>
        <template slot="right">
          <el-form-item label="任务名称" prop="name">
            <el-input :value="formData.name" @input="handleNameChange"></el-input>
          </el-form-item>
          <el-form-item label="任务出口" prop="outgoings">
            <div>{{ formData.outgoings | outgoings }}</div>
          </el-form-item>
        </template>
      </detail-card>
      <detail-card title="表单属性" show-tag>
        <template slot="right">
          <el-form-item label="表单模块" prop="formModule">
            <resource-module-select
              :value="formData.formModule"
              @input="handleModuleChanged"
              :placeholder="$t('流程中心.流程设计/选择表单模块')"
            ></resource-module-select>
          </el-form-item>
          <el-form-item label="表单页面" prop="formPage">
            <el-select :value="formData.formPage" value-key="uuid" @change="handleFormPageChanged">
              <el-option v-for="item in formPages" :key="item.uuid" :value="item" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
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
            <el-table-column width="55" show-overflow-tooltip>
              <span slot="header" :title="$t('公共.表格列/操作')" class="ellipsis">
                {{ $t("公共.表格列/操作") }}
              </span>
              <template slot-scope="{ $index }">
                <el-button type="text" @click="doEditFormParam($index)">设置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </detail-card>
    </el-form>
  </div>
</template>

<script lang="ts" src="./UserTaskPanelEditPanel.ts"></script>

<style lang="scss" scoped>
.user-task-panel {
  &__mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99;
  }

  &__form {
    position: relative;
    z-index: 100;
  }
  &__outgoings-tip {
    color: $--color-text-placeholder;
  }

  .user-task-panel__form-param-add,
  .user-task-panel__outgoing-add {
    width: 100%;
    margin-bottom: 10px;
  }

  .shake {
    .el-form-item.is-error {
      animation: shake 800ms ease-in-out;
    }
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
      transform: translate3d(+2px, 0, 0);
    }
    30%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
      transform: translate3d(+4px, 0, 0);
    }
    50% {
      transform: translate3d(-4px, 0, 0);
    }
  }
}
</style>
