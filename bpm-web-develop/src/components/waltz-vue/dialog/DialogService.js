import Vue from "vue";
import DialogController from "./DialogController";
import MessagePrompt from "../../prompt/MessagePrompt.vue";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const DialogService = function() {};

function removeDialog(controller) {
  document.body.removeChild(controller.component.$el);
  controller.component.$destroy();
}

DialogService.show = function(viewModel, propsData, options) {
  if (Vue.prototype.$isServer) {
    return;
  }

  const MyComponent = Vue.extend(viewModel);
  const div = document.createElement("div");
  document.body.appendChild(div);
  const component = new MyComponent({
    propsData: Object.assign(
      {
        visible: true,
      },
      propsData,
    ),
  }).$mount(div);

  let resolveCloseResult;
  let rejectCloseResult;
  const closeResult = new Promise((resolve, reject) => {
    resolveCloseResult = resolve;
    rejectCloseResult = reject;
  });

  const controller = new DialogController({
    component: component,
    resolve: resolveCloseResult,
    reject: rejectCloseResult,
    options: options,
  });

  closeResult.then(
    () => {
      removeDialog(controller);
    },
    () => {
      removeDialog(controller);
    },
  );

  component.controller = controller;
  return closeResult;
};

DialogService.prompt = function(title, tip, options) {
  return DialogService.show(
    MessagePrompt,
    {
      title,
      tip,
      options,
    },
    options,
  );
};

export default DialogService;
export { DialogService };
