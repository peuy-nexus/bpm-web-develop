<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts" src="./App.ts"></script>
<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  min-width: 1024px;
  overflow-x: auto;
  -webkit-font-smoothing: antialiased;
}

* {
  font-family: Microsoft YaHei;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/*缺省提示*/
.empty-blank-tip {
  color: $--color-text-secondary;
  font-size: $--font-size-base;
  padding-top: 20px;
  padding-bottom: 20px;
  line-height: initial;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: "";
    background: url("~@/assets/img/common/img_blank.png") center center no-repeat;
    background-size: 100%;
    display: inline-block;
    position: relative;
    width: 200px;
    height: 200px;
  }

  &.small {
    &::before {
      width: 96px;
      height: 96px;
    }
  }
}
</style>
