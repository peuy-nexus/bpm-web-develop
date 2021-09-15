/**
 * A controller object for a Dialog instance.
 */
export default class DialogController {
  component;
  resolve;
  reject;
  options;

  /**
   * Creates an instance of DialogController.
   */
  constructor({ component, resolve, reject, options }) {
    this.component = component;
    this.resolve = resolve;
    this.reject = reject;
    this.options = Object.assign(
      {
        rejectOnCancel: false,
      },
      options,
    );
  }

  /**
   * Closes the dialog with a successful output.
   * @param output The returned success output.
   */
  ok(output) {
    return this.close(true, output);
  }

  /**
   * Closes the dialog with a cancel output.
   * @param output The returned cancel output.
   */
  cancel(output) {
    return this.close(false, output);
  }

  /**
   * Closes the dialog.
   * @param ok Whether or not the user input signified success.
   * @param output The specified output.
   * @returns Promise An empty promise object.
   */
  close(ok, output) {
    this.component.visible = false;
    const dialogResult = { wasCancelled: !ok, output };
    if (!this.options.rejectOnCancel || ok) {
      this.resolve(dialogResult);
    } else {
      this.reject(createDialogCancelError(output));
    }
  }
}

/**
 * @internal
 */
export function createDialogCancelError(output) {
  const error = new Error("Operation cancelled.");
  error.wasCancelled = true;
  error.output = output;
  return error;
}
