<script lang="ts" src="./NavMenu.tsx"></script>
<style lang="scss" scoped>
.nav-menu {
  /deep/ .el-submenu__title {
    /*opacity: 0.5;*/
    font-weight: bold;
    color: $--color-text-secondary !important;
    display: flex;
    align-items: center;

    .iconfont {
      /*color: #ffffff;*/
      color: $--color-text-secondary !important;
      /*margin-right: 12px !important;*/
      font-size: 16px;
    }
  }
  /*/deep/.el-menu-item [class^="iconfont"] {*/
  /*  margin-right: 12px;*/
  /*}*/
  /deep/.el-menu-item {
    font-size: 13px;
    color: $--color-text-secondary !important;
  }
  /deep/.el-menu.el-menu--inline .el-menu-item {
    padding-left: 56px !important;
  }
  /deep/.el-menu-item.is-active {
    position: relative;
    background-color: $--color-primary !important;
    color: $--color-white !important;
  }
}
</style>
