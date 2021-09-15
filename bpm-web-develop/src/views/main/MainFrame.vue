<template>
  <div class="mainframe" :class="[embed !== 'false' && `is-embed__${embed}`]">
    <div class="mainframe__nav" v-if="embed !== 'with-menu'">
      <div :class="[navCollapsed ? 'is-expand' : 'is-fold']" @click="navCollapsed = !navCollapsed">
        <i class="iconfont ic-ui-lastone"></i>
      </div>
      <div class="mainframe__nav-header">
        <div :class="['mainframe__nav-logo', navCollapsed ? 'is-collapse' : '']">
          <img :src="require(`@/assets/img/common/${navCollapsed ? 'logo-collapse' : 'logo'}.png`)" alt="logo" />
        </div>
      </div>
      <nav-menu :collapse="navCollapsed"></nav-menu>
    </div>
    <div class="mainframe__main">
      <div class="mainframe__main-header" v-if="embed === 'false'">
        <div></div>
        <div class="mainframe__main-header__right">
          <el-dropdown trigger="click" @command="handleUserCommand">
            <div class="user-info">
              <img src="@/assets/img/common/ic_user.png" class="user-name-icon" />
              {{ user && user.name }} <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="mainframe__main-body" ref="body">
        <transition name="fade-transform" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./MainFrame.ts"></script>

<style lang="scss" scoped>
.mainframe {
  display: flex;
  width: 100%;
  min-height: 100%;
  /*overflow-x: hidden;*/
  background: $--background-color-base;
  height: 100vh;
  overflow: hidden;
  .user-info {
    display: flex;
    align-items: center;
  }

  &__nav {
    position: relative;
    width: 200px;
    min-height: 100vh;
    flex: 0 0 auto;
    background: #2e313d;
    padding-bottom: 68px;

    &-header {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200px;
      padding: 17px 24px 0 24px;
      text-align: center;
      margin-bottom: 2px;
    }

    /*滚动条样式*/
    ::-webkit-scrollbar {
      width: 8px;
      height: 6px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #d7dfeb;
    }

    ::-webkit-scrollbar-track {
      background: #2e313d;
    }

    ::-webkit-scrollbar-corner {
      background: #2e313d;
    }

    /deep/ .el-menu {
      border: none;
      max-height: 100%;
      overflow: auto;

      &.el-menu--inline {
        max-height: initial;
        overflow: hidden;
      }
    }
  }

  &__main {
    flex: 1 1 auto;
    height: 100vh;
    width: 100%;
    overflow: hidden;

    &-header {
      padding: 0 20px;
      width: 100%;
      height: 64px;
      background-color: $--color-white;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-body {
      width: 100%;
      height: calc(100vh - 64px);
      box-sizing: border-box;
      padding: 20px;
      background-color: $--background-color-base;
      overflow: hidden;
    }
  }

  &.is-embed {
    .mainframe__main-body {
      height: 100vh;
      padding: 0;
    }
  }

  /deep/ .el-menu-item {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /deep/ .el-dropdown-menu__item.user-dropdown-item:not(:first-child):hover {
    background: #f1f4f8 !important;
    color: $--color-primary;
  }

  /deep/ .el-dropdown-menu__item.user-dropdown-item:first-child:hover {
    cursor: default;
    background: $--color-white !important;
  }

  .is-fold,
  .is-expand {
    position: absolute;
  }
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
