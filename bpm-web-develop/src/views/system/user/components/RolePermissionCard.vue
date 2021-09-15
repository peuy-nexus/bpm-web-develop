<template>
  <div style="width: 100%">
    <el-card v-for="(item, idx) in processManagementData" :key="idx" class="Role-permission-card">
      <el-row slot="header" class="Role-permission-card__title">
        <el-col :span="7">
          <el-checkbox
            v-model="item.checked"
            :indeterminate="item.isIndeterminate"
            @change="RolePermissionAll(item, item.checked)"
            >{{ $t(`流程中心.系统管理/用户管理/角色管理/角色权限/${item.name}`) }}</el-checkbox
          >
        </el-col>
        <el-col :span="17" class="Role-permission-card__open">
          <span @click="powerShowClick(item)"
            >{{
              item.expand
                ? $t(`流程中心.系统管理/用户管理/角色管理/角色权限/收起`)
                : $t(`流程中心.系统管理/用户管理/角色管理/角色权限/展开`)
            }}<i :class="['iconfont', { 'ic-ui-doubledown': !item.expand, 'ic-ui-doubleup': item.expand }]"></i
          ></span>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <div v-show="item.expand">
          <el-row v-for="(leftItem, index) in item.children" :key="index" class="Role-permission-card__powTable">
            <el-col :span="7">
              <el-checkbox
                v-model="leftItem.checked"
                :indeterminate="leftItem.isIndeterminate"
                class="Role-permission-card__powTable__title"
                @change="RolePermissionRowchange(leftItem, leftItem.checked, item)"
              >
                {{ $t(`流程中心.系统管理/用户管理/角色管理/角色权限/${leftItem.name}`) }}
              </el-checkbox>
            </el-col>
            <el-col :span="17" class="Role-permission-card__powTable__item">
              <el-checkbox
                @change="RolePermissionItemChange(leftItem, item)"
                v-model="rightItem.checked"
                v-for="(rightItem, index2) in leftItem.children"
                :key="index2"
                >{{ $t(`流程中心.系统管理/用户管理/角色管理/角色权限/${rightItem.name}`) }}
              </el-checkbox>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </el-card>
  </div>
</template>

<script lang="ts" src="./RolePermissionCard.ts"></script>

<style lang="scss">
.Role-permission-card {
  margin-bottom: 30px;
  //头部区域
  .el-card__header {
    background-color: #edf1f6;
    border: 0;
    .Role-permission-card__title {
      display: flex;
      justify-content: space-between;
    }
    .Role-permission-card__open {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: $--color-prepared;
      cursor: pointer;
      user-select: none;
      i {
        margin-left: 10px;
      }
    }
  }
  //表格区域
  .el-card__body {
    padding: 0;
    .Role-permission-card__powTable {
      border-top: 1px solid rgb(215, 223, 235);
      .Role-permission-card__powTable__title {
        padding: 15px 15px;
      }
      .Role-permission-card__powTable__item {
        border-left: 1px solid rgb(215, 223, 235);
        padding: 15px 15px;
        .el-checkbox {
          margin-right: 60px;
        }
      }
    }
    .Role-permission-card__powTable:nth-child(even) {
      background-color: $--table-row-hover-background-color;
    }
    .Role-permission-card__powTable:hover {
      background-color: $--table-row-hover-background-color;
    }
  }
}
</style>
