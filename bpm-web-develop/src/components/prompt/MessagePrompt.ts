import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "MessagePrompt",
})
export default class MessagePrompt extends Vue {
  @Prop({ type: Boolean }) visible: boolean;
  @Prop({ type: String }) title: string;
  @Prop({ type: String }) tip: string;
  @Prop({ type: Object }) options: any;

  inputModel: any = {
    name: "",
    text: "",
  };
  controller: any;
  $refs: any;

  get formRules() {
    const rules =
      this.options && this.options.rules
        ? this.options.rules
        : [{ required: true, message: "请输入", trigger: "blur" }];
    return {
      text: rules,
    };
  }

  get inputOptions() {
    return Object.assign(
      {
        resize: "false",
        showWordLimit: true,
        maxlength: 50,
      },
      this.options,
    );
  }

  doConfirm() {
    this.$refs.form.validate((valid: boolean) => {
      if (valid) {
        this.controller.ok(this.inputModel.text);
      }
    });
  }
}
