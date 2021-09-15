<template>
  <wz-search
    :value="value"
    :placeholder="placeholder"
    :clearable="clearable"
    :page-size="0"
    :value-key="`uuid`"
    :value-label="`name`"
    :query-method="queryData"
    @input="handleValueChange($event)"
  >
  </wz-search>
</template>

<script lang="ts" src="./ResourceModuleSelect.ts"></script>

<style lang="scss" scoped></style>
