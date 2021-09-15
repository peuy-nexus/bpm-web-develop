<template>
  <el-dropdown :trigger="trigger" class="el-button bpm-start-button">
    <slot>
      <el-button>发起流程</el-button>
    </slot>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of bpmDefinitions" :key="item.uuid" @click="$emit('start', item)">{{
        item.name
      }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts" src="./BpmStartButton.ts"></script>

<style lang="scss">
.bpm-start-button.el-button {
  padding: 0;
  border: none;
}
</style>
