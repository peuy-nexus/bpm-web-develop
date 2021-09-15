<template>
  <div class="wz-image-upload-body" ref="dragArea">
    <div
      :class="[
        'wz-image-ads-material-upload-body-drag',
        !readonly && fileList.length > 1 ? 'targetClass' : '',
        !readonly && fileList.length > 1 ? 'sourceClass' : '',
      ]"
    >
      <div
        v-for="(file, index) of fileList"
        :key="index"
        class="wz-image-upload-box wz-image-upload-item"
        :class="[
          readonly ? '' : 'wz-image-ads-material-upload-box-drag',
          file.error ? 'wz-image-ads-material-upload-error' : '',
          file.uploading ? 'wz-image-ads-material-upload-item-uploading' : '',
        ]"
        @dragstart="handleDragStart($event, index, file)"
        @dragenter="handleDragEnter($event, file)"
        @dragover.prevent="handleDragover($event, file)"
        @drop="handleDrop($event, index, file)"
        @dragend="handleDragEnd($event, index)"
      >
        <el-image
          ref="imageList"
          class="drag-source-item wz-image-upload-item-cut"
          :style="{ opacity: file.error ? '0.2' : file.uploading ? '0.3' : '1' }"
          :src="file.url"
          @click="doViewImage(false, index)"
          :preview-src-list="getImageUrls(fileList)"
        />

        <div class="wz-image-upload-item-error" v-show="file.error">
          <i class="el-icon-warning"></i>
          <div>{{ file.errorMsg || "上传失败" }}</div>
        </div>
        <template v-if="!readonly && !disabled">
          <div class="wz-image-upload-item-action">
            <div @click="doViewImage(index, true)" v-show="!file.error" class="wz-image-upload-item-action-btn">
              预览
            </div>
            <div @click="changeFile(index)" class="wz-image-upload-item-action-btn">
              更换
            </div>
          </div>
          <i v-if="clearable" class="el-icon-error wz-image-upload-item-close" @click="removeFile(index, $event)"></i>
        </template>
      </div>
    </div>
    <div
      v-if="!readonly && !disabled"
      class="wz-image-upload-box wz-image-upload-new"
      v-show="max > fileList.length"
      @click="selectFile($event)"
      ref="dropTarget"
    >
      <i class="wz-image-upload-new-icon el-icon-plus"></i>
      <div class="wz-image-upload-new-placeholder">{{ placeholder }}</div>
    </div>
    <!--一个隐藏的文件选择提供-->
    <input type="file" style="display:none;" ref="eInput" @change="handleFileSelected($event)" />
  </div>
</template>

<script>
import Emitter from "fant-ui/lib/mixins/emitter";
import Locale from "fant-ui/lib/mixins/locale";
import Focus from "fant-ui/lib/mixins/focus";
import upload from "./upload";

export default {
  mixins: [Emitter, Locale, Focus("reference"), upload],
  name: "wz-image-upload",
  props: {
    //  提示文本
    placeholder: {
      type: String,
      default: "上传图片",
    },
    accept: {
      type: String,
      default: "image/gif,image/jpg,image/jpeg,image/bmp,image/png",
    },
  },
  data() {
    return {
      targetIndex: undefined,
      fileUploaded: {},
      fileAccept: "",
      dragging: null,
    };
  },
  computed: {
    fileList() {
      let list;
      if (this.value === null || this.value === undefined) {
        list = [];
      } else if (Array.isArray(this.value)) {
        list = this.value;
      } else {
        list = [this.value];
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
      return this.max > 1 && this.targetIndex === undefined;
    },
    isUploading() {
      return this.fileList.findIndex(file => file.uploading) >= 0;
    },
  },
  methods: {
    handleDragStart(e, index, file) {
      this.dragFile = file;
      this.dragStartIndex = index;
    },
    handleDragEnter(e) {
      e.dataTransfer.effectAllowed = "move";
    },
    handleDragover(e) {
      e.dataTransfer.dropEffect = "move";
    },
    handleDrop(e, index, file) {
      e.dataTransfer.dropEffect = "move";
      if (index === this.dragStartIndex) {
        return;
      }
      const list = [...this.value];
      list[index] = list[this.dragStartIndex];
      list[this.dragStartIndex] = file;
      this.value = list;
    },
    handleDragEnd() {
      this.dragging = null;
    },
    getImageUrls(lists) {
      return lists.map(list => {
        return list.url;
      });
    },
    doViewImage(index, isViewBtn) {
      this.$refs.imageList[index].clickHandler();
    },
  },
};
</script>

<style scoped lang="scss">
.wz-image-upload {
  display: inline-block;
  width: 100%;

  &-body {
    display: flex;

    &-drag {
      display: flex;
    }
  }

  &-box {
    border: 1px solid $--border-color-base;
    border-radius: $--border-radius-base;
    cursor: pointer;
    width: 80px;
    height: 80px;
    margin-right: 16px;

    &-drag {
      cursor: all-scroll;
    }
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
    margin-right: 0;

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
      border-radius: 0 0 $--border-radius-base $--border-radius-base;
      display: none;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 30%;
      color: $--color-white;
      text-align: center;

      &-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        cursor: pointer;

        &:first-child {
          border-right: solid 0.5px $--color-white;
        }
      }
    }

    &-close {
      border-radius: 20px;
      background-color: #de323299;
      color: $--color-white;
      display: none;
      padding: 3px;
      position: absolute;
      top: -9px;
      right: -9px;

      &:hover {
        background-color: $--color-danger;
        cursor: pointer;
      }
    }

    &:hover {
      .wz-image-upload-item-action {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }

      .wz-image-upload-item-close {
        display: block;
      }
    }
  }
}

.wz-form-item-error {
  .wz-image-upload {
    &-null-value {
      .wz-image-upload-new {
        //@include active-error();
        border-color: $--color-danger;
        outline: 0;
        box-shadow: 0 0 0 2px fade($--color-danger, 20%);
        color: $--color-danger;
      }
    }

    &-error,
    &-item-uploading {
      //@include active-error();
      border-color: $--color-danger;
      outline: 0;
      box-shadow: 0 0 0 2px fade($--color-danger, 20%);
      color: $--color-danger;
    }
  }
}
</style>
