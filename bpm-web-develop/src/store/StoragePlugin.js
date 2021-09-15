/**
 * 对vuex state进行持久化存储，主要用来跨页面间调用
 *
 * @param store
 */
import { CommonUtil } from "fant-ui";
import { storage } from "@/mgr/BrowserMgr";

const storagePlugin = store => {
  const key = "gpweb-vuex";

  // 从缓存中读取
  const storageState = storage.getItem(key);
  const initState = CommonUtil.copy(store.state);
  Object.assign(initState, storageState);
  store.replaceState(initState);

  store.subscribe((mutation, state) => {
    storage.setItem(key, state);
  });
};

export default storagePlugin;
