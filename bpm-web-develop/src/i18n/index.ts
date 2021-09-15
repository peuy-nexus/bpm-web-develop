//i18n.js

import Vue from "vue";
import VueI18n from "vue-i18n";
import locale from "fant-ui/lib/locale";

Vue.use(VueI18n);
const DEFAULT_LANG = "zh";
const LOCALE_KEY = "i18n.locale";
const messages: any = {};
["en", "zh"].forEach(lang => {
  messages[lang] = require(`./langs/${lang}`).default;
});

const langMap: any = {
  en: "en",
  "en-us": "en",
  zh: "zh",
  "zh-cn": "zh",
};
const fantUiLang: Map<string, any> = new Map<string, string>([
  ["zh", require("fant-ui/lib/locale/lang/zh-CN").default],
  ["en", require("fant-ui/lib/locale/lang/en").default],
]);

const i18n = new VueI18n({
  locale: DEFAULT_LANG, // 设置地区
  messages, // 设置地区信息
  fallbackLocale: DEFAULT_LANG,
  formatFallbackMessages: true,
  silentFallbackWarn: true,
});
(window as any).i18n = i18n;
export const localize = (lang: any = null) => {
  if (!lang) {
    lang = localStorage.getItem(LOCALE_KEY);
    if (!messages[lang]) {
      lang = DEFAULT_LANG;
    }
  }

  lang = langMap[lang.toLowerCase()] || lang;
  localStorage.setItem(LOCALE_KEY, lang);
  // Object.keys(messages).forEach(lang => {
  //   document.body.classList.remove(`lang-${lang}`);
  // });
  // document.body.classList.add(`lang-${lang}`);

  (Vue.config as any).lang = lang;
  locale.use(fantUiLang.get(navigator.language.toLowerCase()) || require("fant-ui/lib/locale/lang/zh-CN").default);
  i18n.locale = lang;
};
localize();

export const loadedLangTypes: any = {};
export const loadI18n = (type: string, tenant: string | undefined = undefined) => {
  if (loadedLangTypes[i18n.locale] && loadedLangTypes[i18n.locale][type]) {
    return Promise.resolve();
  }

  loadedLangTypes[i18n.locale] = Object.assign({}, loadedLangTypes[i18n.locale], { [type]: 1 });

  // TODO 获取国际化
  return Promise.resolve();
  // return I18nApi[tenant ? "get" : "getByTypes"]({
  //   lang: i18n.locale,
  //   filters: [
  //     { property: "tq", value: "eq" },
  //     { property: "types", value: [type] },
  //   ],
  // }).then(res => {
  //   Object.assign(messages[i18n.locale], res.data);
  //   i18n.setLocaleMessage(i18n.locale, messages[i18n.locale]);
  //   document.title = `${i18n.t((document as any).i18nTitle)} | hdbpm`;
  // });
};

const init = Vue.prototype._init;
Vue.prototype._init = function(options: any) {
  init.call(this, {
    i18n,
    ...options,
  });
};

export default i18n;
