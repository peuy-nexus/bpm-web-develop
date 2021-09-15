<template>
  <detail-card :title="title">
    <template slot="right">
      <el-row>
        <el-col :span="12">
          <el-form-item :prop="`${fieldProp}.serverUrl`" :rules="rules.serverUrl">
            <span :title="$t('流程中心.系统管理/应用系统/服务访问配置/服务地址')" slot="label">{{
              $t("流程中心.系统管理/应用系统/服务访问配置/服务地址")
            }}</span>
            <el-input
              v-model="value.serverUrl"
              :placeholder="$t('流程中心.系统管理/应用系统/服务访问配置/服务地址/输入提示')"
              @change="handleValueChanged('serverUrl', $event)"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :prop="`${fieldProp}.authType`" :rules="rules.authType">
            <span :title="$t('流程中心.系统管理/应用系统/服务访问配置/授权类型')" slot="label">{{
              $t("流程中心.系统管理/应用系统/服务访问配置/授权类型")
            }}</span>
            <el-select
              v-model="value.authType"
              :placeholder="$t('流程中心.系统管理/应用系统/服务访问配置/授权类型/输入提示')"
              @change="handleAuthTypeChanged('authType', $event)"
            >
              <el-option
                v-for="item in authTypes"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <template v-if="value.authType === 'basic'">
            <el-form-item :prop="`${fieldProp}.authParams`">
              <span :title="$t('流程中心.系统管理/应用系统/服务访问配置/基础授权/用户名')" slot="label">{{
                $t("流程中心.系统管理/应用系统/服务访问配置/基础授权/用户名")
              }}</span>
              <el-input
                :value="authParams.username"
                :placeholder="$t('流程中心.系统管理/应用系统/服务访问配置/基础授权/用户名/输入提示')"
                @change="handleAuthParamsChanged"
              ></el-input>
            </el-form-item>
            <el-form-item :prop="`${fieldProp}.authParams`">
              <span :title="$t('流程中心.系统管理/应用系统/服务访问配置/基础授权/密码')" slot="label">{{
                $t("流程中心.系统管理/应用系统/服务访问配置/基础授权/密码")
              }}</span>
              <el-input
                :value="authParams.password"
                :placeholder="$t('流程中心.系统管理/应用系统/服务访问配置/基础授权/密码/输入提示')"
                @change="handleAuthParamsChanged"
              ></el-input>
            </el-form-item>
          </template>
        </el-col>
      </el-row>
    </template>
  </detail-card>
</template>

<script lang="ts" src="./AppServiceConfig.ts"></script>

<style lang="scss"></style>
