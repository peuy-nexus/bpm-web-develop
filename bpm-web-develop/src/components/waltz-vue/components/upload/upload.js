import { AcceptValidator } from "./accept-validator";
import OssApi from "@/http/bpm/OssApi";

const randomString = len => {
  len = len || 32;
  const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  const maxPos = chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};
// 对更多字符编码的 url encode 格式
const camSafeUrlEncode = str => {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
};

const calculateObjectName = filename => {
  const pos = filename.lastIndexOf(".");
  let suffix = "";
  if (pos !== -1) {
    suffix = filename.substring(pos);
  }
  return String(randomString(16)) + suffix;
};

export default {
  props: {
    value: null,
    //  对象存储签名信息
    signature: null,
    //上传数量限制
    max: {
      type: Number,
      default: 1,
    },
    //图片是否允许删除
    clearable: {
      type: Boolean,
      default: false,
    },
    //图片是否允许删除
    urlOnly: {
      type: Boolean,
      default: false,
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    //  是否只读
    readonly: {
      type: Boolean,
      default: false,
    },
    //  使用文件名上传到对象存储
    originalName: {
      type: Boolean,
      default: false,
    },
    //  上传文件大小限制,单位B
    maxSize: null,
    //  支持剪切板
    clipboard: {
      type: Boolean,
      default: true,
    },
    //  支持文件类型
    accept: null,
    acceptText: null,
    placeholder: {
      type: String,
      default: "点击或拖动文件至虚线框内上传",
    },
    nameLength: Number,
    onBeforeUpload: {
      type: Function,
      default: function(val) {
        return Boolean(val);
      },
    },
  },
  watch: {
    accept(newV) {
      this.acceptValidator = AcceptValidator.parse(newV);
      this.$refs.eInput[this.accept ? "setAttribute" : "removeAttribute"]("accept", newV);
    },
  },
  mounted() {
    if (this.clipboard) {
      document.addEventListener("paste", this.pasteClipboardData);
    }
    if (this.accept) {
      this.acceptValidator = AcceptValidator.parse(this.accept);
      this.$refs.eInput[this.accept ? "setAttribute" : "removeAttribute"]("accept", this.accept);
    }
    if (this.$refs.dropTarget) {
      this.$refs.dropTarget.addEventListener("dragover", this.handleDragOver);
      this.$refs.dropTarget.addEventListener("drop", this.handleDragFileChange);
      this.$refs.dropTarget.addEventListener("dragend", this.handleDragEnd);
    }
  },
  destroyed() {
    if (this.clipboard) {
      document.removeEventListener("paste", this.pasteClipboardData);
    }
    if (this.$refs.dropTarget) {
      this.$refs.dropTarget.removeEventListener("dragover", this.handleDragOver);
      this.$refs.dropTarget.removeEventListener("drop", this.handleDragFileChange);
      this.$refs.dropTarget.removeEventListener("dragend", this.handleDragEnd);
    }
  },
  methods: {
    handleDragOver(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    handleDragFileChange(e) {
      e.preventDefault();
      this.handleFilesDrop(e.dataTransfer.files);
    },
    handleDragEnd(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.clearData();
    },
    pasteClipboardData(event) {
      const items = event.clipboardData && event.clipboardData.items;
      if (items && items.length) {
        const files = [];
        for (const item of items) {
          if (item.kind === "file") {
            files.push(item.getAsFile());
          }
        }
        this.uploadFiles(files);
      }
    },
    //文件切换
    changeFile(index) {
      this.targetIndex = index;
      this.selectFile();
    },
    selectFile() {
      this.$refs.eInput[this.multiple ? "setAttribute" : "removeAttribute"]("multiple", "");
      this.$refs.eInput.click();
    },
    removeFile(index) {
      // if (this.uploadValue) {
      if (!this.multiple) {
        this.$emit("input", null);
      } else if (this.value) {
        this.value.splice(index, 1);
        this.$emit("input", [...this.value]);
        // }
      }
    },
    //文件选择
    handleFileSelected(e) {
      const files = e.target.files;
      const fileList = [];
      for (let i = 0; i < files.length; ++i) {
        fileList.push(files.item(i));
      }
      this.uploadFiles(fileList);
      e.target.value = "";
    },
    //文件上传
    uploadFiles(files) {
      if (this.disabled || !files || files.length === 0) {
        return;
      }
      files.forEach(file => {
        // 图片替换就不用跳过了
        if (this.targetIndex === undefined && this.max && this.fileList.length >= this.max) {
          return;
        }
        const isValid = this.acceptValidator.isValid(file);

        const dotIndex = file.name.lastIndexOf(".");
        const nameLength = file.name.substr(0, dotIndex);
        console.log("file", file, nameLength);
        if (nameLength.length > this.nameLength) {
          this.$message.error(`文件名长度不能超过${this.nameLength}个字符`);
          this.$emit("onUploadFailure", { value: file });
          return;
        }
        if (!isValid) {
          this.$message.error("文件类型不正确");
          this.$emit("onUploadFailure", { value: file });
          return;
        }
        if (this.maxSize > 0 && this.maxSize < file.size) {
          this.$message.error("大小超过限制");
          this.$emit("onUploadFailure", { value: file });
          return;
        }

        this.doUpload(file);
      });
    },
    handleFilesDrop(files) {
      const fileList = [];
      for (let i = 0; i < files.length; ++i) {
        fileList.push(files.item(i));
      }
      this.uploadFiles(fileList);
    },

    doUpload(file) {
      // if (!this.signature) {
      //   file.uploading = false;
      //   file.progress = undefined;
      //   return;
      // }
      OssApi.upload(file)
        .then(res => {
          // 视频上传用到fileUploaded
          this.fileUploaded[res.data] = file;
          const target = this.urlOnly
            ? res.data
            : {
                name: file.name,
                url: res.data,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                file: file,
              };
          if (this.multiple) {
            this.value.splice(this.value.indexOf(file), 1, target);
            this.$emit("input", [...this.value]);
          } else {
            this.$emit("input", target);
          }
        })
        .catch(this.$error);
      //
      // const functionName = `${this.signature.type}Upload`;
      // this[functionName](file, this.signature)
      //   .then(result => {
      //     if (file.progress < 100) {
      //       throw new Error("上传过程中出现未知异常");
      //     }
      //     // 视频上传用到fileUploaded
      //     this.fileUploaded[result.url] = file;
      //     file.uploading = false;
      //     file.progress = undefined;
      //     this.$emit("onUploadSuccess", { value: file });
      //     const item = {
      //       name: result.name,
      //       url: result.url,
      //       size: result.size,
      //       type: result.type,
      //       lastModified: result.lastModified,
      //       lastModifiedDate: result.lastModifiedDate,
      //       file: result
      //     };
      //     if (this.multiple) {
      //       this.uploadValue.splice(this.uploadValue.indexOf(file), 1, this.urlOnly ? item.url : item);
      //       this.uploadValue = [...this.uploadValue];
      //     } else {
      //       this.uploadValue = this.urlOnly ? item.url : item;
      //     }
      //   })
      //   .catch(result => {
      //     result.error = true;
      //     result.uploading = false;
      //     result.errorMsg = "文件上传失败";
      //     this.$emit("onUploadFailure", { value: file });
      //   });
    },
  },
};
