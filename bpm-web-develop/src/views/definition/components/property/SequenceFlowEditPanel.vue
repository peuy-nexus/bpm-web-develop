<template>
  <detail-card class="sequence-flow" title="路径" show-tag>
    <template slot="right">
      <el-form>
        <template v-if="sourceType === 'bpmn:UserTask'">
          <template v-if="formData.customAction">
            <el-form-item label="操作名称">
              <el-input v-model="formData.name" @input="handleNameChange"></el-input>
            </el-form-item>
            <el-form-item label="操作标识">
              <el-input
                v-model="formData.action"
                style="margin-top: 2px"
                placeholder="请输入"
                @input="handleOutgoingChanged"
              ></el-input>
              <el-checkbox v-model="formData.customAction" @change="handleCustomChanged">自定义操作 </el-checkbox>
            </el-form-item>
          </template>

          <el-form-item label="执行操作" v-if="!formData.customAction">
            <el-select :value="formData.action" @change="handleOutgoingChanged">
              <el-option
                v-for="outgoingKey in defaultOutgoingKeys"
                :key="outgoingKey"
                :value="outgoingKey"
                :label="outgoingKey | outgoingName"
              ></el-option>
            </el-select>
            <el-checkbox v-model="formData.customAction" @change="handleCustomChanged">自定义操作 </el-checkbox>
          </el-form-item>
          <el-form-item label="执行业务动作">
            <el-select
              v-model="formData.bizAction"
              value-key="uuid"
              placeholder="可选"
              clearable
              @change="handleBizActionChanged"
            >
              <el-option v-for="item in bizActions" :key="item.uuid" :value="item" :label="item.name"></el-option>
            </el-select>
            <div class="text-secondary-color" style="line-height: 24px">成功完成操作后将回调应用系统执行业务动作</div>
          </el-form-item>
          <el-form-item label="顺序号">
            <wz-input-number
              v-model="formData.lineNo"
              placeholder="请输入顺序号"
              :min="0"
              :max="99"
              @input="handleLineNoChanged"
            ></wz-input-number>
          </el-form-item>
          <el-form-item label="默认出口">
            <el-checkbox v-model="formData.asDefault" @input="handleDefaultChange"></el-checkbox>
            <div class="text-secondary-color" style="line-height: 24px">未指定出口时，将从该出口进行流转</div>
          </el-form-item>
        </template>
        <template v-if="sourceType === 'bpmn:ExclusiveGateway'">
          <el-form-item label="名称">
            <el-input v-model="formData.name" @input="handleNameChange"></el-input>
          </el-form-item>
          <el-form-item label="分支条件" class="sequence-flow__condition">
            <el-input v-model="formData.condition" type="textarea"></el-input>
          </el-form-item>
        </template>
      </el-form>
    </template>
  </detail-card>
</template>

<script lang="ts" src="./SequenceFlowEditPanel.ts"></script>

<style lang="scss" scoped>
.sequence-flow {
}
</style>
