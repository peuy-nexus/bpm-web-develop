<template>
  <el-button class="auth-link ellipsis" type="text" size="small" @click="handleClick" v-if="hasPermission(permission)">
    <slot></slot>
  </el-button>
  <span class="auth-link ellipsis" v-else><slot></slot></span>
</template>

<script lang="ts" src="./AuthLink.ts"></script>

<style lang="scss" scoped>
.auth-link {
  display: inline-block;
  max-width: 100%;
}
</style>
