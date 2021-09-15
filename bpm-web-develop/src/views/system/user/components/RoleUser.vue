<template>
  <list-view
    ref="listView"
    :row-data="userData"
    row-key="uuid"
    :default-sort="{ property: 'key', direction: 'desc' }"
    class="role-user"
  >
    <el-table-column min-width="200" show-overflow-tooltip>
      <span slot="header" :title="$t('流程中心.系统管理/用户管理/用户管理/用户代码')" class="ellipsis">
        {{ $t("流程中心.系统管理/用户管理/用户管理/用户代码") }}
      </span>
      <template slot-scope="{ row }">
        {{ row | empty }}
      </template>
    </el-table-column>
    <el-table-column min-width="180" show-overflow-tooltip>
      <span slot="header" :title="$t('公共.表格列/操作')" class="ellipsis">
        {{ $t("公共.表格列/操作") }}
      </span>
      <template slot-scope="{ row }">
        <el-button type="danger" @click="delRoleUser(row)" icon="el-icon-delete">
          {{ $t("流程中心.系统管理/用户管理/角色管理/角色权限/将用户移出此角色") }}
        </el-button>
      </template>
    </el-table-column>
  </list-view>
</template>

<script lang="ts" src="./RoleUser.ts"></script>

<style lang="scss">
.role-user {
  height: 600px !important;
  width: 100%;
  .list-view__paging {
    display: none;
  }
}
</style>
