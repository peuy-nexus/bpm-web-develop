import { Component, Prop, Vue } from "vue-property-decorator";
import { AcceptValidator } from "@/components/waltz-vue/components/upload/accept-validator";

const titleMap: Map<string, string> = new Map<string, string>([
  ["start", "公共.批量导入弹框/标题/准备上传"],
  ["loading", "公共.批量导入弹框/标题/上传中"],
  ["fail", "公共.批量导入弹框/标题/上传失败"],
  ["finish", "公共.批量导入弹框/标题/上传完成"],
]);
@Component({
  name: "ImportUpload",
})
export default class ImportUpload extends Vue {
  @Prop({ type: Boolean }) visible: boolean; // 标题
  @Prop({ type: String }) templateName: string;
  @Prop({ type: String }) tplKey: string;
  @Prop({ type: String, default: "xls、xlsx" }) fileType: string; // 文件类型限制
  @Prop({ type: Number, default: 1 }) limitQty: number; // 数量限制
  @Prop({ type: Number }) maxSize: number; // 大小限制，单位：M
  @Prop({
    type: String,
    default: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  })
  accept: string; // 文件限制
  @Prop({ type: Function, required: true }) onUpload: any; // 导入

  $refs: any;
  controller: any;
  state: string = "start";
  file: any = null;
  uploading: boolean = false;
  importResult: any = null;
  formModel: any = {};
  rules: any[] = [];

  get title() {
    return this.$t(titleMap.get(this.state) || "");
  }

  mounted(): void {
    this.acceptValidator = AcceptValidator.parse(this.accept);
    this.rules = [
      {
        required: this.required,
        validator: (rule: any, value: any, callback: any) => {
          try {
            this.validateFile();
            return callback();
          } catch (e) {
            return callback(e);
          }
        },
        trigger: "blur",
      },
    ];
  }

  validateFile() {
    if (!this.file) {
      throw new Error(String(this.$t("公共.批量导入弹框/提示/请选择文件")));
    }

    // const isValid = this.acceptValidator.isValid(this.file);
    // if (!isValid) {
    //   throw new Error("文件类型不正确，仅支持xls、xlsx格式文件");
    // }
    if (!this.file.name.endsWith(".xls") && !this.file.name.endsWith(".xlsx")) {
      throw new Error(String(this.$t("公共.上传控件/文件格式提示", [this.fileType])));
    }
    if (this.file.size > this.maxSize * 1024 * 1024) {
      throw new Error(String(this.$t("公共.上传控件/文件大小提示", [this.maxSize])));
    }
  }

  handleFileSelected(e: any) {
    this.file = e.target.files.item(0);
    this.$nextTick(() => {
      this.$refs.formItem.validate("blur");
    });
  }

  handleDownloadTpl() {
    const url = `./${this.tplKey}`;
    fetch(url).then(res =>
      res.blob().then(blob => {
        const a = document.createElement("a");
        const url1 = window.URL.createObjectURL(blob);
        a.href = url1;
        a.download = this.tplKey;
        a.click();
        window.URL.revokeObjectURL(url1);
      }),
    );
  }

  doUpload() {
    this.$refs.form.validate((valid: any) => {
      if (!valid) {
        return;
      }

      this.uploading = true;
      this.onUpload(this.file)
        .then((result: any) => {
          this.uploading = false;
          this.importResult = Object.assign({}, result);
          this.state = this.importResult.success ? "finish" : "fail";
        })
        .catch((error: any) => {
          this.state = "fail";
          this.importResult = {
            success: false,
            message: error.toString(),
          };
        });
    });
  }

  doConfirm() {
    this.controller.ok(this.importResult);
  }

  downloadResult() {
    const a = document.createElement("a");
    a.href = this.importResult.data.fileUrl;
    a.download = "导入";
    a.click();
    this.controller.ok();
  }
}
