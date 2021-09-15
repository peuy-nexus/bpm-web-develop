import Vue from "vue";
import ElementUI from "fant-ui";

Vue.use(ElementUI);

ElementUI.Form.props.labelWidth.default = "120px";
ElementUI.Form.props.inlineMessage.default = false;

// 测试说要启用斑马纹
ElementUI.Table.props.stripe.default = true;

// 默认不可以通过点击 modal 关闭 confirm
ElementUI.MessageBox.setDefaults({
  closeOnClickModal: false,
});
// 默认不可以通过点击 modal 关闭 Dialog
ElementUI.Dialog.props.closeOnClickModal.default = false;
// 默认关闭 Dialog 的时候自动销毁
ElementUI.Dialog.props.destroyOnClose.default = true;
// 默认关闭 Dialog 的时候自动销毁
ElementUI.Dialog.props.beforeClose.default = function(done) {
  if (this.$parent && this.$parent.controller) {
    this.$parent.controller.close();
  }
  done();
};
