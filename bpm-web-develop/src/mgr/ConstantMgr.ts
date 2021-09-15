import i18n from "@/i18n";

export const loadingOption = {
  lock: true,
  text: i18n.t("公共.下拉框控件/加载中"),
  spinner: "el-icon-loading",
  background: "transparent",
};
export const loadingSaveOption = {
  lock: true,
  text: i18n.t("公共.保存动作/保存中"),
  spinner: "el-icon-loading",
  background: "rgba(0, 0, 0, 0.5)",
};
export default {
  loadingOption,
  loadingSaveOption,
};
