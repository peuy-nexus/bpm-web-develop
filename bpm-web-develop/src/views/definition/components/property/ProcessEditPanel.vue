<template>
  <detail-card class="process-panel" title="流程信息" show-tag>
    <template slot="right">
      <el-form>
        <el-form-item label="流程Key">
          {{ formData.id }}
        </el-form-item>
        <el-form-item label="流程名称">
          <el-input v-model="formData.name" @change="handleChange('name', $event)"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </detail-card>
</template>

<script lang="ts" src="./ProcessEditPanel.ts"></script>

<style lang="scss">
.process-panel {
}
</style>
