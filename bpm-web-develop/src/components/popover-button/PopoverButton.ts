import { Component, Prop, Vue } from "vue-property-decorator";
import Clickoutside from "fant-ui/lib/utils/clickoutside";

const isServer = Vue.prototype.$isServer;
/* istanbul ignore next */
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element: any, event: any, handler: any) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element: any, event: any, handler: any) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

@Component({
  name: "PopoverButton",
  directives: { Clickoutside },
})
export default class PromTemplateModal extends Vue {
  @Prop({ type: Boolean, default: true }) actions: boolean;
  object = {};

  $refs: any;

  mounted(): void {
    on(document, "click", this.handleDocumentClick);
  }

  destroyed(): void {
    off(document, "click", this.handleDocumentClick);
  }

  handleDocumentClick(e: any) {
    if (this.$refs.popover) {
      // this.$refs.popover.handleDocumentClick.call(this.$refs.popover, e);
    }
  }

  handleClose() {
    this.$refs.popover.doClose();
  }

  handleConfirm() {
    this.$emit("confirm", this.object);
    this.$refs.popover.doClose();
  }
}
