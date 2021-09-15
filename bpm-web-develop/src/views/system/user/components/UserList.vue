<template>
  <div class="user-list">
    <query-condition :actions="['search', 'reset']" @search="doSearch" @reset="doReset">
      <el-col :span="12" :lg="8" :xl="6">
        <el-form-item>
          <div slot="label" :title="$t('流程中心.系统管理/用户管理/用户信息')" class="ellipsis">
            {{ $t("流程中心.系统管理/用户管理/用户信息") }}
          </div>
          <el-input
            v-model.trim="filterParams.keyword"
            clearable
            :placeholder="$t('流程中心.系统管理/用户管理/用户信息/输入提示')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" :lg="8" :xl="6">
        <el-form-item>
          <div slot="label" :title="$t('流程中心.系统管理/用户管理/所属角色')" class="ellipsis">
            {{ $t("流程中心.系统管理/用户管理/所属角色") }}
          </div>
          <role-search
            v-model.trim="filterParams['name:%=%']"
            clearable
            :placeholder="$t('流程中心.系统管理/用户管理/所属角色提示')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" :lg="8" :xl="6" v-if="!hidePost">
        <el-form-item>
          <div slot="label" :title="$t('流程中心.系统管理/用户管理/所属岗位')" class="ellipsis">
            {{ $t("流程中心.系统管理/用户管理/所属岗位") }}
          </div>
          <post-search
            v-model.trim="filterParams['name:%=%']"
            clearable
            :placeholder="$t('流程中心.系统管理/用户管理/所属岗位提示')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" :lg="8" :xl="6" v-if="!hideDepartment">
        <el-form-item>
          <div slot="label" :title="$t('流程中心.系统管理/用户管理/所属部门')" class="ellipsis">
            {{ $t("流程中心.系统管理/用户管理/所属部门") }}
          </div>
          <department-search
            v-model.trim="filterParams['name:%=%']"
            clearable
            :placeholder="$t('流程中心.系统管理/用户管理/所属部门提示')"
          />
        </el-form-item>
      </el-col>
    </query-condition>
    <list-view
      ref="listView"
      :row-data="rowData"
      :row-total="rowTotal"
      row-key="uuid"
      @selected="handleSelectRowChange"
      @load="doListLoad"
      :default-sort="{ property: 'key', direction: 'desc' }"
    >
      <el-table-column fixed="left" min-width="150" show-overflow-tooltip prop="key" :sortable="'custom'">
        <span slot="header" :title="$t('流程中心.系统管理/用户管理/用户代码')" class="ellipsis">
          {{ $t("流程中心.系统管理/用户管理/用户代码") }}
        </span>
        <template slot-scope="{ row }">{{ row.code | empty }}</template>
      </el-table-column>
      <el-table-column min-width="200" show-overflow-tooltip>
        <span slot="header" :title="$t('流程中心.系统管理/用户管理/用户名称')" class="ellipsis">
          {{ $t("流程中心.系统管理/用户管理/用户名称") }}
        </span>
        <template slot-scope="{ row }">
          {{ row.name | empty }}
        </template>
      </el-table-column>
      <el-table-column min-width="180" show-overflow-tooltip>
        <span slot="header" :title="$t('流程中心.系统管理/用户管理/所属角色')" class="ellipsis">
          {{ $t("流程中心.系统管理/用户管理/所属角色") }}
        </span>
        <template slot-scope="{ row }">
          <span v-for="(role, i, key) in row.roles" :key="key">
            {{ role.name | empty }}{{ i != row.roles.length - 1 ? "," : "" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="180" show-overflow-tooltip>
        <span slot="header" :title="$t('流程中心.系统管理/用户管理/所属岗位')" class="ellipsis">
          {{ $t("流程中心.系统管理/用户管理/所属岗位") }}
        </span>
        <template slot-scope="{ row }">
          <span v-for="(post, i, key) in row.posts" :key="key">
            {{ post.name | empty }}{{ i != row.posts.length - 1 ? "," : "" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="180" show-overflow-tooltip>
        <span slot="header" :title="$t('流程中心.系统管理/用户管理/所属部门')" class="ellipsis">
          {{ $t("流程中心.系统管理/用户管理/所属部门") }}
        </span>
        <template slot-scope="{ row }">
          <span v-for="(department, i, key) in row.departments" :key="key">
            {{ department.name | empty }}{{ i != row.departments.length - 1 ? "," : "" }}
          </span>
        </template>
      </el-table-column>
    </list-view>
  </div>
</template>

<script lang="ts" src="./UserList.ts"></script>

<style lang="scss">
.user-list {
  height: 100%;
  padding: 12px 16px 20px 16px;
  display: flex;
  flex-direction: column;

  .list-view {
    flex-grow: 1;
    flex-shrink: 1;
  }
}
</style>
