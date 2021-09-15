<template>
  <page-wrapper>
    <template slot="header">
      {{ $t("流程中心.系统管理/应用系统/标题") }}
      <div>
        <el-button>取消</el-button>
        <el-button type="primary" @click="doSave">保存</el-button>
      </div>
    </template>
    <template slot="body">
      <el-form :model="entity" :rules="rules" ref="form">
        <detail-card :title="$t('流程中心.系统管理/应用系统/基础信息')">
          <template slot="right">
            <el-row>
              <el-col :span="6">
                <el-form-item prop="code">
                  <span :title="$t('流程中心.系统管理/应用系统/代码')" slot="label">{{
                    $t("流程中心.系统管理/应用系统/代码")
                  }}</span>
                  <el-input
                    :placeholder="$t('流程中心.系统管理/应用系统/代码/输入提示')"
                    v-model="entity.code"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="name">
                  <span :title="$t('流程中心.系统管理/应用系统/名称')" slot="label">{{
                    $t("流程中心.系统管理/应用系统/名称")
                  }}</span>
                  <el-input
                    :placeholder="$t('流程中心.系统管理/应用系统/名称/输入提示')"
                    v-model="entity.name"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <span :title="$t('流程中心.系统管理/应用系统/组织控制')" slot="label">{{
                    $t("流程中心.系统管理/应用系统/组织控制")
                  }}</span>
                  <el-switch v-model="entity.orgControl"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item>
                  <span :title="$t('流程中心.系统管理/应用系统/访问Url')" slot="label">{{
                    $t("流程中心.系统管理/应用系统/访问Url")
                  }}</span>
                  <el-input
                    :placeholder="$t('流程中心.系统管理/应用系统/访问Url/输入提示')"
                    v-model="entity.url"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="remark">
                  <span :title="$t('流程中心.系统管理/应用系统/说明')" slot="label">{{
                    $t("流程中心.系统管理/应用系统/说明")
                  }}</span>
                  <el-input
                    type="textarea"
                    :placeholder="$t('流程中心.系统管理/应用系统/说明/输入提示')"
                    v-model="entity.remark"
                    :maxlength="200"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </detail-card>
        <app-service-config
          v-model="entity.processNoticeConfig"
          field-prop="processNoticeConfig"
          :title="$t('流程中心.系统管理/应用系统/流程定义通知配置')"
        ></app-service-config>
        <app-service-config
          v-model="entity.resourceModuleConfig"
          field-prop="resourceModuleConfig"
          :title="$t('流程中心.系统管理/应用系统/资源模块查询配置')"
        ></app-service-config>
        <app-service-config
          v-model="entity.bizProviderConfig"
          field-prop="bizProviderConfig"
          :title="$t('流程中心.系统管理/应用系统/业务服务回调配置')"
        ></app-service-config>
      </el-form>
    </template>
  </page-wrapper>
</template>

<script lang="ts" src="./AppSystemEdit.ts"></script>

<style lang="scss"></style>
