<template>
  <div class="properties-edit-panel">
    <component
      :is="componentName"
      :modeling="modeling"
      :moddle="moddle"
      :bpmn-element="bpmnElement"
      :bpmnx="value"
      @change="$emit('input', $event)"
    ></component>
  </div>
</template>

<script lang="ts" src="./PropertyEditPanel.ts"></script>

<style lang="scss">
.properties-edit-panel {
  background-color: $--color-white;
  .detail-card {
    padding: 0 32px;
  }
}
</style>
