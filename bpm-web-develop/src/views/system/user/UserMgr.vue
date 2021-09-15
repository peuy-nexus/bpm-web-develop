<template>
  <page-wrapper class="user-mgr">
    <template slot="header">
      <el-tabs v-model="currentTab" @tab-click="handleTabClick">
        <el-tab-pane v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label"></el-tab-pane>
      </el-tabs>
      <div v-if="currentTab === 'RoleList'">
        <el-button type="primary" @click="$refs.component.doCreate()" icon="iconfont ic-ui-plus">{{
          $t("公共.操作/新建")
        }}</el-button>
      </div>
    </template>
    <template slot="body">
      <component :is="currentTab" ref="component"></component>
    </template>
  </page-wrapper>
</template>

<script lang="ts" src="./UserMgr.ts"></script>

<style lang="scss">
.user-mgr {
  &.page-wrapper {
    .page-body {
      padding: 0;
    }
  }
}
</style>
