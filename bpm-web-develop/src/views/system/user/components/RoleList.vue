<template>
  <div class="Role-list">
    <role-filter
      ref="RefRoleFilter"
      :uuid.sync="uuid"
      :processData.sync="processManagementData"
      :activeName="activeName"
      :selectUser.sync="selectUser"
      :currentNum.sync="current"
    ></role-filter>
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane :label="$t('流程中心.系统管理/用户管理/角色管理/角色权限')" name="rolePermissions">
        <el-button
          type="primary"
          class="Role-list_preservation"
          @click="savePermissions"
          icon="iconfont ic-ui-setting"
          >{{ $t("流程中心.系统管理/用户管理/角色管理/角色权限/保存角色权限") }}</el-button
        >
        <role-permission-card :processData.sync="processManagementData"></role-permission-card>
      </el-tab-pane>
      <el-tab-pane :label="$t('流程中心.系统管理/用户管理/角色管理/角色用户')" name="roleUser">
        <div class="Role-list__selectRole">
          <el-button type="primary" class="Role-list_preservation" @click="setRoleUser" icon="iconfont ic-ui-setting">
            {{ $t("流程中心.系统管理/用户管理/角色管理/角色权限/设置角色用户") }}</el-button
          >
        </div>
        <role-user :selectUser.sync="selectUser" :uuid.sync="uuid" ref="RoleUser"></role-user>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="$t('流程中心.系统管理/用户管理/角色管理/新建角色')" :visible.sync="dialogFormVisible">
      <el-form :v-model="createRoleForm" ref="createRoleRuleForm" :rules="rules">
        <el-form-item :label="$t('流程中心.系统管理/用户管理/角色管理/名称')" prop="name">
          <el-input
            v-model="createRoleForm.name"
            autocomplete="off"
            :placeholder="$t('流程中心.系统管理/用户管理/角色管理/说明输入提示/角色名称提示')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRole">{{ $t("公共.操作/取消") }}</el-button>
        <el-button type="primary" @click="creatrRole">{{ $t("公共.操作/确定") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./RoleList.ts"></script>

<style lang="scss">
.Role-list {
  display: flex;
  flex-direction: row;
  padding: 0;
  .el-tabs {
    width: 100%;
    padding: 0px 20px;
    .el-tab-pane {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
  .Role-list_preservation {
    margin-bottom: 12px;
    margin-right: 0 !important;
  }
  .Role-list__selectRole {
    display: flex;
    .el-button {
      margin-right: 20px;
      flex-grow: 0;
    }
    .el-select {
      width: 300px;
    }
  }
}
</style>
