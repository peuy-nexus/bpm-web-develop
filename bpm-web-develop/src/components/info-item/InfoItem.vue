<template>
  <div class="info-form__item">
    <span class="info-form__item-label">{{ label }}：</span>
    <span class="info-form__item-value" v-if="$slots.default">
      <slot></slot>
    </span>
    <slot name="extra"></slot>
  </div>
</template>

<script lang="ts" src="./InfoItem.ts"></script>

<style lang="scss">
.info-form__item {
  display: flex;
  line-height: 18px;
  &-label {
    padding: 9px 0;
    flex-shrink: 0;
    color: $--color-text-regular;
  }
  &-value {
    padding: 9px 12px 9px 0;
    color: $--color-text-primary;
    overflow-wrap: anywhere;
  }
}

.el-table__row .cell {
  .info-form__item {
    line-height: 23px;
    &-label {
      padding: 0;
    }
    &-value {
      padding: 0;
    }
  }
}
</style>
