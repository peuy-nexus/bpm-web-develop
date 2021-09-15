<template>
  <detail-card class="sequence-flow" title="顺序流" show-tag>
    <template slot="right">
      <el-form>
        <el-form-item label="名称">{{ formData.name }}</el-form-item>
      </el-form>
    </template>
  </detail-card>
</template>

<script lang="ts" src="./SequenceFlowViewPanel.ts"></script>

<style lang="scss">
.sequence-flow {
}
</style>
