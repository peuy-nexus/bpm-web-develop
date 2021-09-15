<template>
  <el-dialog title="删除流程分组" width="600px" :visible.sync="visible">
    <el-form ref="form" :model="formData" :rules="rules">
      <div>删除该流程分组后，分组下流程转移到指定流程分组</div>
      <el-form-item label="流程分组" prop="upperUuid">
        <bpm-group-select
          placeholder="请选择流程分组"
          v-model="formData.upper"
          @change="formData.upperUuid === $event.uuid"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="controller.cancel()">取 消</el-button>
      <el-button type="primary" @click="doSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./BpmGroupDeleteDialog.ts"></script>

<style lang="scss"></style>
