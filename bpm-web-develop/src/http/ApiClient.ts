import Vue from "vue";
import axios from "axios";
import store from "../store";
import router from "../router";
import StringUtil from "@/components/waltz-vue/utils/StringUtil";

let logout: any = null;
const qs = require("qs");
axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};
axios.defaults.timeout = 60000;

export default class ApiClient {
  public static file(baseUrl: string) {
    return axios.create({
      baseURL: baseUrl,
    });
  }

  public static server() {
    const baseUrl: any = process.env.VUE_APP_BASEURL;
    return ApiClient.create(baseUrl);
  }

  public static create(baseUrl: string) {
    const instance = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
    });

    instance.interceptors.request.use(
      request => {
        request.headers["trace_id"] = StringUtil.uuid();
        console.log("store.state", store.state);
        if (store.state.authorization) {
          request.headers.authorization = store.state.authorization;
        }
        if (store.state.token && store.state.tokenName) {
          request.headers[store.state.tokenName] = store.state.token;
        }
        if (store.state.user) {
          //统一设置商户信息
          if (request.url && request.url.search("{tenant}") !== -1) {
            request.url = request.url.replace("{tenant}", store.state.tenant);
          }
          request.headers["userId"] = store.state.user.uuid;
          request.headers["userCode"] = store.state.user.code;
          request.headers["tenant"] = store.state.tenant;
        }
        return request;
      },
      error => {
        return Promise.reject(error);
      },
    );

    instance.interceptors.response.use(
      response => {
        if (response.data instanceof ArrayBuffer) {
          return response;
        }
        if (response.data.success || response.data.success === undefined) {
          if (response.headers[store.state.tokenName]) {
            store.commit("permissions", response.headers[store.state.tokenName]);
          }
          return response;
        } else {
          const error = new Error();
          if (response.data.code === 1401) {
            if (router.currentRoute.name != "login" && !logout) {
              logout = Vue.prototype.$alert(response.data.message, { showClose: false }).then(() => {
                logout = null;
                router.push("/login");
              });
            }
            return Promise.reject();
          }
          if (response.data.message) {
            error.message = response.data.message;
          } else if (response.data.message) {
            error.message = response.data.message;
          } else if (response.data.message) {
            error.message = response.status + "服务器内部异常";
          }
          (error as any).response = response.data;

          if (response.data.code === 20002) {
            error.message = "登录已过期,请重新登录!";
            router.push("/login");
          }
          throw error;
        }
      },
      error => {
        if (!error.response) {
          error.message = "请检查网络设置";
          return Promise.reject(error);
        }
        switch (error.response.status) {
          case 101:
            break;
          case 401:
            error.message = "登录已过期,请重新登录!";
            router.push("/login");
            break;
          case 403:
            error.message = error.response.message;
            router.push("/login");
            break;
          case 503:
            error.message = "服务器升级中!";
            break;
          case 500:
            error.message = error.response.data.msg || "服务内部异常!";
            break;
          default:
            error.message = "未知错误";
        }
        return Promise.reject(error);
      },
    );
    return instance;
  }
}
