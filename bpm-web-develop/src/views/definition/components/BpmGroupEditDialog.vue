<template>
  <el-dialog :title="value && value.uuid ? '编辑流程分组' : '新建流程分组'" width="600px" :visible.sync="visible">
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item label="上级分组" prop="upperUuid" v-if="!formData.uuid || formData.upper">
        <bpm-group-select
          v-model="formData.upper"
          :disabled="!!formData.uuid"
          placeholder="请选择上级分组"
          @change="formData.upperUuid === $event.uuid"
        />
      </el-form-item>
      <el-form-item label="分组名称" prop="name">
        <el-input
          v-model="formData.name"
          :placeholder="$t('流程中心.流程分组/名称/输入提示')"
          maxlength="10"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <!--      <el-button @click="controller.cancel()">取 消</el-button>-->
      <!--      <el-button type="primary" @click="doSave">确 定</el-button>-->
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./BpmGroupEditDialog.ts"></script>

<style lang="scss"></style>
