<template>
  <div class="bpm-definition-view">
    <div class="bpm-definition-view__toolbar">
      <div></div>
      <div>
        <el-button @click="doBack">返回</el-button>
        <el-button type="primary" @click="doEdit">流程设计</el-button>
        <el-button type="primary" @click="doStart" v-if="nodeEnv === 'development'">发起流程</el-button>
      </div>
    </div>
    <div class="bpm-definition-view__body">
      <process-viewer
        v-model="entity.design.modelXml"
        @init-finished="bpmnModeler = $event"
        @selection-changed="handleSelectionChanged"
      ></process-viewer>
      <property-view-panel
        v-model="entity.design.extend"
        :entity="entity"
        :bpmn-modeler="bpmnModeler"
        :bpmn-element="bpmnElement"
        @entity-change="doGet"
      ></property-view-panel>
    </div>
  </div>
</template>

<script lang="ts" src="./BpmDefinitionView.ts"></script>

<style lang="scss">
.bpm-definition-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 10px 0 mix($--color-white, $--color-black, 80%);

  &__toolbar {
    width: 100%;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $--color-white;
    border-bottom: $--border-base;
  }

  &__body {
    flex: 1;
    display: flex;

    .properties-view-panel {
      width: 400px;
      flex-shrink: 0;
      flex-grow: 0;
    }
  }

  .progress-viewer {
    flex: 1;
  }
}
</style>
