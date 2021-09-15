<template>
  <el-dialog :title="value && value.uuid ? '编辑流程定义' : '新建流程定义'" width="600px" :visible.sync="visible">
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item :label="$t('流程中心.流程定义/流程Key')" prop="key" v-if="!formData.uuid">
        <el-input
          v-model="formData.key"
          :disabled="!!formData.uuid"
          :placeholder="$t('流程中心.流程定义/流程Key/输入提示')"
        />
      </el-form-item>
      <el-form-item :label="$t('流程中心.流程定义/流程名称')" prop="name">
        <el-input
          v-model="formData.name"
          :placeholder="$t('流程中心.流程定义/流程名称/输入提示')"
          maxlength="32"
          show-word-limit
        />
      </el-form-item>
      <el-form-item :label="$t('流程中心.流程定义/应用系统')" prop="group" v-if="!formData.uuid">
        <app-system-search v-model="formData.appSystem" :placeholder="$t('流程中心.流程定义/应用系统/输入提示')" />
      </el-form-item>
      <el-form-item :label="$t('流程中心.流程定义/流程分组')" prop="group" v-if="!formData.uuid">
        <bpm-group-select v-model="formData.group" :placeholder="$t('流程中心.流程定义/流程分组/输入提示')" />
      </el-form-item>
      <el-form-item :label="$t('流程中心.流程定义/发起模块')" prop="startModule" v-if="!formData.uuid">
        <resource-module-select v-model="formData.startModule" :placeholder="$t('流程中心.流程设计/选择表单模块')" />
      </el-form-item>
      <el-form-item :label="$t('流程中心.流程定义/流程说明')" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          placeholder="请输入流程说明"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="controller.cancel()">取 消</el-button>
      <el-button type="primary" @click="doSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./BpmDefinitionEditDialog.ts"></script>

<style lang="scss"></style>
