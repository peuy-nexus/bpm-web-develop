<template>
  <wz-search
    :value="value"
    :placeholder="placeholder"
    :clearable="clearable"
    :page-size="pageSize"
    :value-key="`uuid`"
    :value-label="`name`"
    :multiple="multiple"
    :query-method="queryData"
    @input="handleValueChange($event)"
  >
  </wz-search>
</template>

<script lang="ts" src="./DepartmentSearch.ts"></script>

<style lang="scss" scoped></style>
