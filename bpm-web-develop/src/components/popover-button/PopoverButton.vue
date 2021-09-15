<template>
  <el-popover
    ref="popover"
    placement="top"
    width="250"
    trigger="manual"
    v-clickoutside="handleClose"
    class="popover-button el-button el-button--text"
  >
    <div class=" popover-button__popover">
      <p class=" popover-button__popover-tip">
        <slot name="tip" :object="object"></slot>
      </p>
      <div class=" popover-button__popover-action" v-if="actions">
        <el-button @click="$refs.popover.doClose()">{{ $t("公共.操作/取消") }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ $t("公共.操作/确定") }}</el-button>
      </div>
    </div>
    <el-button
      class="popover-button__reference"
      slot="reference"
      type="text"
      size="small"
      @click="$refs.popover.doToggle()"
    >
      <slot></slot>
    </el-button>
  </el-popover>
</template>

<script lang="ts" src="./PopoverButton.ts"></script>

<style lang="scss" scoped>
.popover-button {
  &__popover {
    &-tip {
      margin: 20px;
    }

    &-action {
      text-align: right;
      margin: 0;
    }
  }

  .el-button {
    padding: 0;
  }
}
</style>
