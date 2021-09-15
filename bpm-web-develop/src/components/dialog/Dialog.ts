import Vue from "vue";
import store from "../../store/index";
import router from "../../router";
import DialogView from "./DialogView.vue";
// import i18n from '../../locale/Locale.js'

let instances: any = [];

export default class Dialog {
  dialog: any;

  constructor(view: any, cfg: any) {
    this.dialog = new (Vue.extend(DialogView))({
      // i18n,
      store,
      router,
    });
    Object.assign(this.dialog, cfg);

    this.dialog.currentView = {
      mixins: [view],
      data() {
        cfg = cfg || {};
        return cfg;
      },
    };
    this.dialog.$mount();

    this.dialog.$once("hide", (target: any) => {
      instances.splice(instances.indexOf(target), 1);
    });
    instances.push(this.dialog);
  }

  bind(cmp: any) {
    cmp.$on("hook:beforeDestroy", () => {
      this.hide();
    });
    return this;
  }

  show() {
    if (this.dialog.canShow()) {
      this.dialog.show();
    } else {
      this.dialog.hide();
    }
  }

  hide() {
    this.dialog.hide();
  }

  static closeAll() {
    instances.forEach((item: any) => {
      item.$off();
      item.hide();
    });
    instances = [];
  }
}
