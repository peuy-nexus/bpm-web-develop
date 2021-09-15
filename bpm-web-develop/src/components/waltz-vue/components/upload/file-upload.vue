<template>
  <div class="wz-file-upload">
    <div class="wz-file-upload-body'">
      <div
        class="wz-file-upload-input"
        :class="{
          'wz-file-upload-disabled': max <= fileList.length,
        }"
        v-if="!disabled && !readonly"
        @click="selectFile($event)"
        ref="dropTarget"
      >
        <i class="el-icon-upload wz-file-upload-input-icon"></i>
        <div class="wz-file-upload-input-placeholder">{{ placeholder }}</div>
        <div class="wz-file-upload-input-accept-text">{{ acceptText }}</div>
      </div>
      <div
        :class="[
          'wz-file-ads-material-upload-item',
          file.uploading ? 'wz-file-ads-material-upload-item-uploading' : '',
        ]"
        v-for="(file, index) in fileList"
        :key="index"
      >
        <div class="wz-file-upload-item-process" :style="{ width: file.process + 'px' }"></div>
        <div class="wz-file-upload-item-name">
          <img :src="file.url" alt="" class="wz-file-upload-item-preview" v-if="file.type.indexOf('image') > -1" />
          <span>{{ file.name }}</span>
        </div>
        <i class="el-icon-error wz-file-upload-item-close" @click="removeFile(index, $event)"></i>
        <i
          class="el-icon-success wz-file-upload-item-success"
          v-if="!disabled && !readonly && file.progress === undefined"
        ></i>
      </div>
    </div>
    <!--一个隐藏的文件选择提供-->
    <input type="file" style="display:none;" ref="eInput" multiple @change="handleFileSelected($event)" />
  </div>
</template>

<script>
import Emitter from "fant-ui/lib/mixins/emitter";
import Locale from "fant-ui/lib/mixins/locale";
import Focus from "fant-ui/lib/mixins/focus";
import upload from "./upload";

export default {
  mixins: [Emitter, Locale, Focus("reference"), upload],
  name: "wz-file-upload",
  props: {
    placeholder: {
      type: String,
      default: "点击或拖动文件至虚线框内上传",
    },
  },
  data() {
    return {
      prefixCls: "wz-file-upload",
      targetIndex: undefined,
      fileAccept: "",
      uploadValue: "",
      fileUploaded: {},
    };
  },
  computed: {
    fileList() {
      let list;
      if (this.uploadValue === null || this.uploadValue === undefined) {
        list = [];
      } else if (Array.isArray(this.uploadValue)) {
        list = this.uploadValue;
      } else {
        list = [this.uploadValue];
      }
      return list.map(item => {
        if (typeof item === "string") {
          return { url: item };
        } else if (item.url) {
          return item;
        } else {
          item.url = window.URL.createObjectURL(new Blob([item], { type: "application/zip" }));
          return item;
        }
      });
    },
    isUploading() {
      return this.fileList.findIndex(file => file.uploading) >= 0;
    },
    multiple() {
      return this.max > 1 && this.targetIndex === undefined;
    },
  },
  watch: {},

  methods: {},
};
</script>
<style lang="scss">
.wz-file-upload {
  display: inline-block;
  width: 100%;

  &-input {
    border: 1px dashed $--border-color-base;
    border-radius: $--border-radius-base;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: $--color-text-secondary;
    line-height: 1.5;
    width: 100%;
    max-width: 400px;
    height: 180px;

    &-disabled {
      cursor: not-allowed;
      color: $--color-text-placeholder;
      border-color: $--color-text-placeholder;
    }

    &-icon {
      font-size: 48px;
      line-height: 1.5;
    }

    &:hover {
      border-color: mix(#ffffff, $--color-primary, 20%);
    }
  }

  &-item {
    position: relative;
    max-width: 400px;

    &-name {
      display: flex;
      padding: 2px 32px 2px 2px;
      line-height: 32px;

      span {
        display: inline-block;
        padding: 0 4px;
      }
    }

    &-preview {
      width: 32px;
      height: 32px;
    }

    &-progress {
      width: 0;
      vertical-align: middle;
      line-height: 32px;
      background: $--color-primary;
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      transition: width 0.3s ease-in-out;

      &::before {
        content: "";
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        border-radius: 10px;
        animation: wz-progress-active 2s ease-in-out infinite;
      }
    }

    &-success,
    &-close {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 30px;
      height: 30px;
      font-size: 18px;
      line-height: 30px;
    }

    &-success {
      color: $--color-success;
      background: white;
    }

    &-close {
      color: $--color-text-placeholder;
      cursor: pointer;

      &:hover {
        color: $--color-text-secondary;
      }
    }

    &-error {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      color: $--color-danger;
      text-align: center;
      line-height: 1.5;

      .wz-icon {
        font-size: 24px;
        line-height: 1.5;
      }
    }

    &:hover {
      background: #f0fafe;

      .wz-file-upload-item-success {
        display: none;
      }
    }
  }
}

.wz-file-upload-error {
  .wz-file-upload {
    &-new {
      color: $--color-danger;
    }

    &-item-uploading {
      color: $--color-danger;
    }
  }
}
</style>
