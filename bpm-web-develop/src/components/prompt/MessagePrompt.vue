<template>
  <el-dialog :title="title" :visible.sync="visible" width="400px" class="message-prompt">
    <el-form ref="form" label-width="auto" label-position="top" :model="inputModel" :rules="formRules">
      <el-form-item :label="tip" prop="text">
        <el-input
          type="textarea"
          :resize="inputOptions.resize"
          v-model="inputModel.text"
          :show-word-limit="inputOptions.showWordLimit"
          :maxlength="inputOptions.maxlength"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="doConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./MessagePrompt.ts"></script>
<style lang="scss" scoped></style>
