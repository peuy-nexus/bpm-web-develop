<template>
  <el-dialog :title="value ? '编辑表单参数' : '新建表单参数'" width="600px" :visible.sync="visible">
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item :label="$t('流程中心.流程定义/页面参数/名称')" prop="name">
        <el-input
          v-model="formData.name"
          :placeholder="$t('流程中心.流程定义/页面参数/名称/输入提示')"
          maxlength="100"
          readonly
        />
      </el-form-item>
      <el-form-item :label="$t('流程中心.流程定义/页面参数/参数表达式')" prop="expr">
        <el-input
          v-model="formData.expr"
          :placeholder="$t('流程中心.流程定义/页面参数/参数表达式/输入提示')"
          maxlength="100"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="controller.cancel()">取 消</el-button>
      <el-button type="primary" @click="doConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./FormParamDialog.ts"></script>

<style lang="scss"></style>
