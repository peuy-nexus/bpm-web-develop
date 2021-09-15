<template>
  <div :class="['wz-video-upload', fileList.length === 0 ? 'wz-video-ads-material-upload-null-value' : '']">
    <div class="wz-video-upload-body">
      <template>
        <div
          v-for="(file, index) in fileList"
          :key="index"
          ref="eItem"
          class="wz-video-upload-box wz-video-upload-item"
          :class="[
            file.error ? 'wz-image-ads-material-upload-error' : '',
            file.uploading ? 'wz-image-ads-material-upload-item-uploading' : '',
          ]"
        >
          <div
            class="wz-video-upload-item-progress"
            :style="{ width: file.progress + '%' }"
            v-show="file.uploading"
          ></div>
          <video
            class="wz-video-upload-item-cut"
            v-show="!file.error"
            :alt="file.name"
            :src="file.type ? '' : file.url"
          ></video>
          <div class="wz-video-upload-item-error" v-show="file.error">
            <i class="el-icon-warning"></i>
            <div>{{ file.errorMsg || "上传失败" }}</div>
          </div>

          <template v-if="!readonly && !disabled">
            <div class="wz-video-upload-item-action" @click="changeFile(index)">
              点击更换
            </div>
            <i if.bind="clearable" class="wz-video-upload-item-close el-icon-error" @click="removeFile(index)"></i>
          </template>
        </div>
      </template>
      <div
        if.bind="!readonly && !disabled"
        class="wz-video-upload-box wz-video-upload-new"
        show.bind="max>fileList.length"
        @click="selectFile()"
        ref="dropTarget"
        file-drop-target.call="handleFilesDrop($event)"
      >
        <i class="wz-video-upload-new-icon el-icon-plus"></i>
        <div class="wz-video-upload-new-placeholder">{{ placeholder }}</div>
      </div>
    </div>

    <!--一个隐藏的文件选择提供-->
    <input type="file" hide="true" style="display: none" ref="eInput" @change="handleFileSelected($event)" />
  </div>
</template>

<script>
import Emitter from "fant-ui/lib/mixins/emitter";
import Locale from "fant-ui/lib/mixins/locale";
import Focus from "fant-ui/lib/mixins/focus";
import upload from "./upload";

export default {
  mixins: [Emitter, Locale, Focus("reference"), upload],
  name: "wz-video-upload",
  props: {
    accept: {
      type: String,
      default: "video/*",
    },
    //  提示文本
    placeholder: {
      type: String,
      default: "上传视频",
    },
  },
  data() {
    return {
      uploadValue: this.value,
      targetIndex: undefined,
      fileAccept: "",
    };
  },
  computed: {
    fileList() {
      //文件列表
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
        }
        return Object.assign(
          {
            url: window.URL.createObjectURL(new Blob([item], { type: "application/zip" })),
          },
          item,
        );
      });
    },
    multiple() {
      //监听是否为多文件上传
      return this.max > 1 && this.targetIndex === undefined;
    },
    isUploading() {
      return this.fileList.findIndex(file => file.uploading) >= 0;
    },
  },
  watch: {},
  methods: {},
};
</script>

<style scoped lang="scss">
.wz-video-upload {
  display: inline-block;
  width: 100%;

  &-body {
    display: flex;

    > .wz-video-upload-box:not(:first-child) {
      margin-left: 16px;
    }
  }

  &-box {
    border: 1px solid $--border-color-base;
    border-radius: $--border-radius-base;
    cursor: pointer;
    width: 80px;
    height: 80px;
  }

  &-new {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-style: dashed;
    color: $--color-text-secondary;
    cursor: pointer;
    line-height: 1.5;

    &-icon {
      font-size: 24px;
      line-height: 1.5;
    }

    &:hover {
      border-color: mix(#ffffff, $--color-primary, 20%);
    }
  }

  &-item {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    &-cut {
      max-width: calc(100% - 8px);
      max-height: calc(100% - 8px);
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
        background: $--color-white;
        border-radius: 10px;
        animation: wz-progress-active 2s ease-in-out infinite;
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

    &-action {
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: $--border-color-base;
      display: none;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      color: $--color-white;
      text-align: center;
    }

    &-close {
      border-radius: 20px;
      background-color: $--color-danger;
      color: $--color-white;
      display: none;
      padding: 3px;
      position: absolute;
      top: -9px;
      right: -9px;
    }

    &:hover {
      .wz-video-upload-item-action {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .wz-video-upload-item-close {
        display: block;
      }
    }
  }
}

.wz-form-item-error {
  .wz-video-upload {
    &-null-value {
      .wz-video-upload-new {
        color: $--color-danger;
        border-color: $--color-danger;
        outline: 0;
        box-shadow: 0 0 0 2px fade($--color-danger, 20%);
      }
    }

    &-error,
    &-item-uploading {
      color: $--color-danger;
      border-color: $--color-danger;
      outline: 0;
      box-shadow: 0 0 0 2px fade($--color-danger, 20%);
    }
  }
}
</style>
