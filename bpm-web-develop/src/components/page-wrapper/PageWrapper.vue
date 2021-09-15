<template>
  <!-- 基础页面外层包裹容器 -->
  <div class="page-wrapper">
    <!--    <div class="page-wrapper__nav">-->
    <!--      <el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--        <el-breadcrumb-item v-for="(item, index) in breadCrumb" :key="index">-->
    <!--          <div-->
    <!--            class="page-header__breadcrumb-item"-->
    <!--            :class="{ 'is-link': !!item.route }"-->
    <!--            @click="handleBreadcrumbClick(item)"-->
    <!--          >-->
    <!--            <div v-if="index < breadCrumb.length - 1">{{ item.name }}</div>-->
    <!--            <template v-else>-->
    <!--              <div :title="item.name" class="page-header__title ellipsis">{{ item.name }}</div>-->
    <!--            </template>-->
    <!--          </div>-->
    <!--        </el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--      <div class="page-actions" v-if="$slots.actions">-->
    <!--        <slot name="actions"></slot>-->
    <!--      </div>-->
    <!--    </div>-->
    <!-- 页面头部 开始-->
    <div class="page-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <!-- 页面头部 结束 -->

    <div class="page-wrapper__content" :class="[isList ? 'is-list' : '']">
      <!-- 查询条件 开始 -->
      <div class="page-query" v-if="$slots.query">
        <slot name="query"></slot>
      </div>
      <!-- 查询条件 结束 -->
      <!-- 页面主体内容区 开始 -->
      <div class="page-body" v-if="$slots.body">
        <slot name="body"></slot>
      </div>
      <!-- 页面主体内容区 结束 -->
    </div>
  </div>
</template>

<script lang="ts" src="./PageWrapper.ts"></script>

<style lang="scss" scoped>
.page-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: $--background-color-base;
  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /deep/ .el-breadcrumb {
    padding: 12px 0;
    display: flex;
    align-items: baseline;
    width: 100%;
    > .el-breadcrumb__item {
      display: flex;
      flex-shrink: 0;
      line-height: $--font-line-height-primary;
      align-items: center;

      .el-breadcrumb__inner {
        width: 100%;
      }
      &:last-child {
        flex-shrink: 1;
        overflow: hidden;
        .page-header__breadcrumb-item {
          color: $--color-text-regular;
          font-size: $--font-size-large;
          font-weight: $--font-weight-bold;
        }
      }

      .page-header__breadcrumb-item {
        cursor: default;
        color: $--color-text-secondary;
        font-weight: $--font-weight-regular;

        &.is-link {
          cursor: pointer;
          &:hover {
            color: $--color-primary;
          }
        }
      }
    }
  }

  &__content {
    border-radius: 0 0 12px 12px;
    height: 100%;
    background: $--color-white;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  &__content.is-list {
    border-radius: 12px;
  }

  .page-header {
    background: $--color-white;
    border-bottom: 1px solid $--border-color-base;
    height: 56px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    padding: 0 32px;
    color: #36445a;
    border-radius: 12px 12px 0 0;
    /deep/.el-tabs__header {
      margin: 0;
    }
    /deep/.el-tabs__nav-wrap::after {
      height: 0;
    }
    /deep/.el-tabs__item {
      height: 56px;
      line-height: 56px;
    }

    &__title {
      max-width: 100%;
    }
  }
  /deep/ .page-query {
    border-radius: 12px 12px 0 0;
    width: 100%;
    box-sizing: border-box;
    padding: 20px 16px;
    background: #ffffff;
    flex-shrink: 0;
  }
  /deep/ .page-body {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 8px 16px 20px;
    background: #ffffff;
    overflow: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;

    &::-webkit-scrollbar-track {
      background: $--color-white;
    }
  }
}
</style>
