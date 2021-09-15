<template>
  <div class="bpm-definition-edit">
    <div class="bpm-definition-edit__toolbar">
      <div>
        <el-button :disabled="!revocable" @click="bpmnModeler.get('commandStack').undo()">撤销</el-button>
        <el-button :disabled="!recoverable" @click="bpmnModeler.get('commandStack').redo()">重做</el-button>
      </div>
      <div>
        <el-button @click="doCancel()">取消</el-button>
        <el-button @click="doViewXml">查看xml</el-button>
        <el-button @click="doSave(false)">保存</el-button>
        <el-button :disabled="bpmDefinition.state === 'disabled'" type="primary" @click="doSave(true)"
          >保存并发布</el-button
        >
      </div>
    </div>
    <div class="bpm-definition-edit__body">
      <process-designer
        v-model="entity.modelXml"
        :extend="entity.extend"
        @init-finished="handleInitFinished"
        @import-done="handleImportDone"
        @selection-changed="handleSelectionChanged"
        @element-changed="handleElementChanged"
        @shape-added="handleShapeAdded"
        @shape-removed="handleShapeRemoved"
        @connection-added="handleConnectionAdded"
        @connection-removed="handleConnectionRemoved"
        @commandStack-changed="handleCommandStackChanged"
      ></process-designer>
      <property-edit-panel
        v-model="entity.extend"
        :bpmn-modeler="bpmnModeler"
        :bpmn-element="bpmnElement"
      ></property-edit-panel>
    </div>
  </div>
</template>

<script lang="ts" src="./BpmDefinitionEdit.ts"></script>

<style lang="scss">
.bpm-definition-edit {
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
    .properties-edit-panel {
      width: 400px;
      flex-shrink: 0;
      flex-grow: 0;
    }
  }
  .progress-designer {
    flex: 1;
  }
}
</style>
