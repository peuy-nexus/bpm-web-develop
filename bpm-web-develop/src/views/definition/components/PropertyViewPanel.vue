<template>
  <div class="properties-view-panel">
    <component
      :is="componentName"
      :modeling="modeling"
      :moddle="moddle"
      :bpmn-element="bpmnElement"
      :bpmnx="value"
      :entity="entity"
      @entity-change="$emit('entity-change', $event)"
    ></component>
  </div>
</template>

<script lang="ts" src="./PropertyViewPanel.ts"></script>

<style lang="scss">
.properties-view-panel {
  background-color: $--color-white;
  .detail-card {
    padding: 0 32px;
  }
}
</style>
