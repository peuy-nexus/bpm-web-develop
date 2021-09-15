import Vue from "vue";
import Vuex from "vuex";
import { state, getters, actions, mutations } from "./global";

import StoragePlugin from "@/store/StoragePlugin.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [StoragePlugin],

  state,
  getters,
  mutations,
  actions,

  modules: {},
});

export default store;
