<template>
  <div class="login">
    <div style="flex: 11"></div>
    <div class="login__right">
      <el-form
        ref="loginForm"
        class="login__form"
        :model="formData"
        label-width="0"
        :show-message="false"
        :rules="rules"
      >
        <div class="login__logo"></div>
        <div class="login__welcome">
          <p>{{ $t("登录.标题副词") }}</p>
          <h1>{{ $t("登录.标题") }}</h1>
        </div>
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="formData.username"
            prefix-icon="ic_login_user"
            :placeholder="$t('登录.请输入账户名')"
            @keydown.enter.native="focusRefs('password')"
            maxLength="20"
            class="icon__username"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            ref="password"
            type="password"
            class="login__password"
            prefix-icon="ic_login_password"
            maxLength="20"
            :placeholder="$t('登录.请输入密码')"
            @keydown.enter.native="focusRefs('validCode')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="validCode">
          <el-input
            v-model="formData.validCode"
            ref="validCode"
            class="login__validCode"
            prefix-icon="ic-ui-unlock"
            maxLength="4"
            :placeholder="$t('登录.验证码')"
            @keydown.enter.native="doLogin"
          >
            <img slot="suffix" class="valid-code__img" :src="validCodeImage" @click="doFetchImage" />
          </el-input>
        </el-form-item>
        <div class="login__error el-form-item__error" :title="errorMessage">{{ errorMessage }}</div>
        <el-button type="primary" class="login__button" @click="doLogin">{{ $t("登录.登录按钮") }}</el-button>
      </el-form>
      <div class="copyright" v-html="copyright"></div>
    </div>
  </div>
</template>

<script lang="ts" src="./Login.ts"></script>

<style lang="scss">
#app {
  background: #fff4e5;
}
.login {
  height: 100%;
  width: 100%;
  min-height: 768px;
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
  background: url("../../assets/img/login/login_background.png") center center no-repeat;
  background-size: cover;
  border-radius: 4px;

  &__right {
    flex: 7;
    display: flex;
    justify-content: center;
    background: $--color-white;
  }

  //登录主要内容盒子中的欢迎字体样式
  &__welcome {
    text-align: left;
    width: 100%;
    p {
      font-size: 20px;
      line-height: 36px;
    }
    h1 {
      color: $--color-text-primary;
      font-size: 36px;
      line-height: 58px;
    }
  }

  //logo样式
  &__logo {
    background: url("../../assets/img/login/logo.svg") left center no-repeat;
    width: 360px;
    height: 28px;
    position: absolute;
    top: 10%;
  }

  //form表单样式
  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border-radius: 0 26px 26px 0;
    height: 100%;
    width: 360px;
    position: relative;
    //表单项样式
    .el-form-item {
      margin-top: 24px;
      width: 100%;
      height: 44px;
    }

    .el-form-item__content {
      height: 100%;
    }

    //表单样式
    .el-input {
      height: 100%;
      .el-input__inner {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 0;
        padding-left: 45px;
        border-bottom: 1px solid $--border-color-base;
      }
      input:hover {
        border-bottom: 1px solid $--border-color-hover;
      }
      .el-input__inner:focus {
        border-bottom: 1px solid $--color-primary;
      }
    }
    //输入框icon图标
    .el-input__prefix {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  //输入框
  .el-input__prefix i[class*="ic_login_"] {
    background-size: 100%;
    width: 24px;
    height: 24px;
    display: block;
  }
  //用户名的默认icon
  .ic_login_user {
    background: url("../../assets/img/login/icon/ic_username.svg") center center no-repeat;
  }
  //密码的默认icon
  .ic_login_password {
    background: url("../../assets/img/login/icon/ic_password.svg") center center no-repeat;
  }
  //验证码的默认icon
  .ic-ui-unlock {
    background: url("../../assets/img/login/icon/ic_identification.svg") center center no-repeat;
  }
  .ic-ui-unlock:before {
    content: "";
  }
  //验证码图片样式
  .valid-code__img {
    position: relative;
  }
  //输入用户名ysername hover事件
  .icon__username > input:hover ~ .el-input__prefix .ic_login_user {
    background: url("../../assets/img/login/icon/ic_username_hovor.svg") center center no-repeat;
  }
  //输入用户名ysername focus事件
  .icon__username > input:focus ~ .el-input__prefix .ic_login_user {
    background: url("../../assets/img/login/icon/ic_username_focus.svg") center center no-repeat;
  }
  //输入密码password hover事件
  .login__password > input:hover ~ .el-input__prefix .ic_login_password {
    background: url("../../assets/img/login/icon/ic_password_hovor.svg") center center no-repeat;
  }
  //输入密码password focus事件
  .login__password > input:focus ~ .el-input__prefix .ic_login_password {
    background: url("../../assets/img/login/icon/ic_password_focus.svg") center center no-repeat;
  }
  //输入验证码valid-code hover事件
  .login__validCode > input:hover ~ .el-input__prefix .ic-ui-unlock {
    background: url("../../assets/img/login/icon/ic_identification_hovor.svg") center center no-repeat;
  }
  //输入验证码valid-code focus事件
  .login__validCode > input:focus ~ .el-input__prefix .ic-ui-unlock {
    background: url("../../assets/img/login/icon/ic_identification_focus.svg") center center no-repeat;
  }
  //自定义的表单效验信息
  &__error {
    width: 100%;
    line-height: 24px;
    overflow: hidden;
    font-size: 14px;
    text-align: left;
  }
  //登录按钮
  &__button {
    width: 100%;
    height: 45px;
    margin-top: 30px;
    border-radius: 8px;
    border: 0px;
    font-size: 16px;
    background-color: $--button-info-background-color;
  }
  //覆盖初始按钮hover focus样式
  //.el-button--primary:hover,
  //.el-button--primary:focus {
  //  background-color: #4c64eb;
  //}
  //公司信息
  .copyright {
    position: absolute;
    bottom: 5%;
    left: 0;
    right: 0;
    color: $--color-text-placeholder;
    text-align: center;
    line-height: 20px;
    padding: 0 35px;
  }
}
</style>
