<template>
  <div class="role-filter">
    <div class="role-filter__header">
      <el-input :placeholder="$t('流程中心.系统管理/用户管理/角色管理/搜索/角色信息提示')" v-model="roleCode"
        ><el-button slot="append" icon="el-icon-search" @click="selectRole"></el-button>
      </el-input>
    </div>
    <div class="role-filter__body" ref="body">
      <div
        v-for="(item, index) in gettableData"
        :class="['role-filter__item', { 'role-filter__current': index === current }]"
        :key="index"
        @click="getRolePermissions(item.uuid, index, activeName)"
      >
        <div>[{{ item.code }}]{{ item.name }}</div>
        <el-popover placement="right" width="50" trigger="click">
          <el-button class="role-filter__button" @click="editRoleshow(item)">{{
            $t("流程中心.系统管理/用户管理/角色管理/操作/编辑")
          }}</el-button>
          <el-popconfirm
            :title="$t('流程中心.系统管理/用户管理/角色管理/操作/确定删除')"
            icon="el-icon-info"
            iconColor="red"
            @onConfirm="deleteRole(item.uuid)"
          >
            <el-button class="role-filter__button" slot="reference">{{
              $t("流程中心.系统管理/用户管理/角色管理/操作/删除")
            }}</el-button>
          </el-popconfirm>
          <i slot="reference" class="iconfont ic-ui-more"></i>
        </el-popover>
      </div>
    </div>
    <el-dialog :title="$t('流程中心.系统管理/用户管理/角色管理/修改角色')" :visible.sync="dialogFormVisible">
      <el-form :model="editRoleForm" ref="createRoleRuleForm" :rules="rules">
        <el-form-item :label="$t('流程中心.系统管理/用户管理/角色管理/名称')" prop="name">
          <el-input
            v-model="editRoleForm.name"
            autocomplete="off"
            :placeholder="$t('流程中心.系统管理/用户管理/角色管理/说明输入提示/角色名称提示')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRole">{{ $t("公共.操作/取消") }}</el-button>
        <el-button type="primary" @click="editRole">{{ $t("公共.操作/确定") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./RoleFilter.ts"></script>

<style lang="scss">
.role-filter {
  border-right: $--border-base;
  width: 266px;
  flex-shrink: 0;
  padding: 0px 12px 0px 16px;
  .role-filter__body {
    height: 750px;
    overflow: auto;
  }
  //隐藏滚动条
  .role-filter__body::-webkit-scrollbar {
    width: 0;
  }
  .role-filter__header {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #fff;
    padding: 12px 0px 12px 0px;
  }
  .role-filter__body .role-filter__item:nth-child(even) {
    background-color: $--table-row-hover-background-color;
  }
  .role-filter__item:hover {
    background-color: $--table-row-hover-background-color;
  }
  .role-filter__current {
    background-color: $--color-warning-lighter !important;
  }
  .role-filter__current:hover {
    background-color: $--color-prepared;
  }
}
.role-filter__item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  cursor: pointer;
}
.role-filter__button {
  width: 100%;
  margin: 0 !important;
  border: 0 !important;
}
</style>
