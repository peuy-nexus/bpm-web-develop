import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n, { localize } from "./i18n";
// import Filter from './cmd/Filter.js'
import PermissionMgr from "@/mgr/PermissionMgr";
import { PermissionEnum } from "@/config/PermissionEnum";
// import locale from "fant-ui/lib/locale/lang/en";

import "./components";
import "@/assets/styles/app.scss";

import Fant from "fant-ui";

import Filter from "./filter/index";

Filter.init();

process.env.NODE_ENV === "development" && require("./mock/mock");
Vue.use(Fant);
Vue.config.productionTip = false;

Vue.prototype.hasPermission = PermissionMgr.hasPermission;
Vue.prototype.permission = PermissionEnum;
Vue.prototype.i18n = i18n;
Vue.prototype.$localize = localize;
Vue.prototype.unReadNumber = 0;
Vue.prototype.nodeEnv = process.env.NODE_ENV;
Vue.prototype.$error = (error: any) => {
  if (!error) return;
  console.error(error);
  Vue.prototype.$message.error(error instanceof Error ? error.message : "业务异常，请联系开发人员。");
};

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount("#app");

Object.assign(window, {
  vueEnv: process.env,
  i18n: i18n,
});
