<template>
  <div class="process-view-panel">
    <detail-card title="基础信息" show-tag>
      <template slot="head-right">
        <el-button type="text" @click="doModify">修改</el-button>
      </template>
      <template slot="right">
        <info-item label="流程Key">{{ entity.key }}</info-item>
        <info-item label="流程名称">{{ entity.name }}</info-item>
        <info-item label="流程状态">
          <template v-if="entity.state === 'initial'">未发布</template>
          <template v-else>
            <el-switch :value="entity.state === 'enabled'" @change="doChangeState"></el-switch>
            <span style="margin-left: 12px;">{{ entity.state | state }}</span>
          </template>
        </info-item>
        <info-item label="流程分组">{{ entity.group && entity.group.name | empty }}</info-item>
        <info-item label="发起模块">{{ entity.startModule && entity.startModule.name | empty }}</info-item>
        <!--              <info-item label="生效组织">生效组织</info-item>-->
        <info-item label="流程说明">{{ entity.description | empty }}</info-item>
        <info-item label="版本号">V1</info-item>
      </template>
    </detail-card>
    <detail-card title="发起人列表" show-tag class="process-view-panel__starters">
      <template slot="right">
        <el-button @click="doAddStarters" class="process-view-panel__starters-add" icon="iconfont ic-ui-plus"
          >添加发起人</el-button
        >
        <el-table ref="starters" :data="entity.starters" max-height="400px">
          <el-table-column min-width="80">
            <span slot="header" :title="$t('流程中心.流程定义/身份/类型')" class="ellipsis">
              {{ $t("流程中心.流程定义/身份/类型") }}
            </span>
            <template slot-scope="{ row }">
              {{ row.identityType | identityType }}
            </template>
          </el-table-column>
          <el-table-column min-width="120" show-overflow-tooltip prop="barcode">
            <span slot="header" :title="$t('流程中心.流程定义/流程发起人')" class="ellipsis">
              {{ $t("流程中心.流程定义/流程发起人") }}
            </span>
            <template slot-scope="{ row }">
              {{ row.name | empty }}
            </template>
          </el-table-column>
          <el-table-column width="80" show-overflow-tooltip>
            <span slot="header" :title="$t('公共.表格列/操作')" class="ellipsis">
              {{ $t("公共.表格列/操作") }}
            </span>
            <template slot-scope="{ $index }">
              <popover-button @confirm="doDeleteStarter($index)">
                <span>{{ $t("公共.操作/删除") }}</span>
                <span slot="tip">{{ $t("公共.操作/删除/提示语") }}</span>
              </popover-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </detail-card>
  </div>
</template>

<script lang="ts" src="./ProcessViewPanel.ts"></script>

<style lang="scss">
.process-view-panel {
  &__starters {
    &-add {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
