<template>
  <el-dialog title="选择模块" width="600px" :visible.sync="visible">
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item :label="$t('流程中心.流程定义/身份/类型')" prop="identityType">
        <el-select
          v-model="formData.identityType"
          :placeholder="$t('流程中心.流程定义/身份/类型/输入提示')"
          @change="handleIdentityTypeChanged"
        >
          <el-option
            v-for="identityType of identityTypeKeys"
            :key="identityType"
            :value="identityType"
            :label="identityType | identityType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="formData.identityType | identityType" prop="identities" v-if="formData.identityType">
        <el-button @click="doSelectIdentity" type="text">选择{{ formData.identityType | identityType }}</el-button>
        <div>{{ formData.identities.map(item => item.name).join(",") }}</div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="controller.cancel()">取 消</el-button>
      <el-button type="primary" @click="doConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./IdentityPickDialog.ts"></script>

<style lang="scss" scoped></style>
