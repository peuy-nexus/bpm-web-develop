import { ActionTree, Commit } from "vuex";
import { localize } from "@/i18n";

// import LoginUser from "@/model/wholesale/user/LoginUser";

export interface State {
  tenant: any;
  user: any; // 当前用户
  token: string;
  tokenName: string;
  authorization: string;
  permissions: string[]; // 权限列表（单单权限信息）
  systemConfig: any;
  lang: string;
  embed: string;
}

export const state: State = {
  tenant: {},
  user: {},
  permissions: [],
  token: "",
  tokenName: "",
  authorization: "",
  systemConfig: {},
  lang: "ZH",
  embed: "false",
};

/**
 * 通常不直接调用这个方法
 */
export const mutations = {
  tenant(state: State, tenant: any) {
    state.tenant = tenant;
  },
  user(state: State, user: any) {
    state.user = user;
  },
  permissions(state: State, permissions: string[]) {
    state.permissions = permissions;
  },
  token(state: State, token: string) {
    state.token = token;
  },
  tokenName(state: State, tokenName: string) {
    state.tokenName = tokenName;
  },
  authorization(state: State, authorization: string) {
    state.authorization = authorization;
  },
  systemConfig(state: State, systemConfig: any) {
    state.systemConfig = systemConfig;
  },
  embed(state: State, embed: any) {
    state.embed = embed;
  },
  lang(state: State, lang: any) {
    state.lang = lang;
    localize(lang);
  },
  /**
   * 清除状态，通常在退出应用时执行
   */
  clear(state: State) {
    state.user = null;
    state.tokenName = "";
    state.token = "";
    state.authorization = "";
    state.permissions = [];
  },
};

export const getters = {};

/**
 * 修改状态只提倡用dispatch
 */
export const actions: ActionTree<State, any> = {
  tenant(context: { commit: Commit }, tenant: any) {
    context.commit("tenant", tenant);
  },
  user(context: { commit: Commit }, user: any) {
    context.commit("user", user);
  },
  permissions(context: { commit: Commit }, permissions: string[]) {
    context.commit("permissions", permissions);
  },
  token(context: { commit: Commit }, token: string) {
    context.commit("token", token);
  },
  tokenName(context: { commit: Commit }, tokenName: string) {
    context.commit("tokenName", tokenName);
  },
  authorization(context: { commit: Commit }, authorization: string) {
    context.commit("authorization", authorization);
  },
  systemConfig(context: { commit: Commit }, systemConfig: any) {
    context.commit("systemConfig", systemConfig);
  },
  embed(context: { commit: Commit }, embed: any) {
    context.commit("embed", embed);
  },
  lang(context: { commit: Commit }, lang: any) {
    context.commit("lang", lang);
  },
  clear(context: { commit: Commit }) {
    context.commit("clear");
  },
};

export default { state, getters, mutations, actions };
