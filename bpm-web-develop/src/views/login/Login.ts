import { Component, Vue } from "vue-property-decorator";
import ConstantMgr from "@/mgr/ConstantMgr";
import { Action } from "vuex-class";
import { loadI18n } from "@/i18n";
import LoginApi from "@/http/bpm/LoginApi";

const language = navigator.language.toLowerCase();

@Component({})
export default class Login extends Vue {
  $refs: any;

  @Action("lang") setLang: (lang: any) => void;
  @Action("user") setUser: (user: any) => void;
  @Action("tenant") setTenant: (tenant: any) => void;
  @Action("token") setToken: (token: string) => void;
  @Action("tokenName") setTokenName: (tokenName: string) => void;
  @Action("systemConfig") setSystemConfig: (systemConfig: any) => void;
  @Action("authorization") setAuthorization: (authorization: string) => void;

  validCodeImage: any = null;
  formData: any = {
    validCode: "",
  }; // 登录信息
  rules = {
    username: [{ required: true, trigger: "blur" }],
    password: [{ required: true, trigger: "blur" }],
    validCode: [{ required: true, trigger: "blur" }],
  };
  errorMessage: string = "";

  // 计算属性 函数名前面加get
  get copyright() {
    return process.env.VUE_APP_COPYRIGHT;
  }

  mounted() {
    //记载上一次记住登录的信息
    if (localStorage.getItem("username")) {
      this.formData.code = localStorage.getItem("username");
    }
    if (localStorage.getItem("password")) {
      this.formData.password = localStorage.getItem("password");
    }
    this.setLang(language);
    loadI18n("登陆", "-");
    this.doFetchImage();
    this.$refs.username.focus();
  }

  focusRefs(refName: string) {
    if (this.$refs[refName]) {
      this.$refs[refName].focus();
    }
  }

  /**
   * 获取验证码图片地址
   */
  doFetchImage() {
    const baseUrl = process.env.VUE_APP_BASEURL;
    this.formData.requestId = this.getUuid();
    this.formData.validCode = "";

    this.validCodeImage = `${baseUrl}/v1/auth/verification/captcha?requestid=${this.formData.requestId}`;
  }

  /**
   * 登录
   */
  doLogin() {
    this.$refs.loginForm.validate(() => {
      if (!this.formData.username) {
        return (this.errorMessage = this.$t("登录.请输入账户名") as any);
      } else if (!new RegExp(/^[\w]+@[\w]+$/i).test(this.formData.username)) {
        return (this.errorMessage = this.$t("登录.账号格式错误") as any);
      } else if (!this.formData.password) {
        return (this.errorMessage = this.$t("登录.请输入密码信息") as any);
      } else if (!new RegExp(/^[\w]+$/i).test(this.formData.password)) {
        return (this.errorMessage = this.$t("登录.密码格式错误") as any);
      }
      this.errorMessage = "";

      const formData: any = Object.assign({}, this.formData, {
        tenant: this.formData.username.split("@")[1],
        username: this.formData.username.split("@")[0],
      });
      const loading = this.$loading(ConstantMgr.loadingOption);
      LoginApi.login(formData)
        .then((resp: any) => {
          const loginResult = resp.data;
          this.setUser(loginResult.user);
          this.setTenant(loginResult.user.tenant);
          this.setAuthorization(loginResult.authorization);
          this.setToken(loginResult.token);
          this.setTokenName(loginResult.tokenName);

          loading.close();
          this.$router.push({ name: "BpmDefinitionList" });
        })
        .catch((error: any) => {
          loading.close();
          this.$error(error);
        });
    });
  }

  /**
   * 获取requestId
   */
  getUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
