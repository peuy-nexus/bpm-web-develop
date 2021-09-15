<template>
  <el-dialog
    :title="title"
    class="import-upload"
    :element-loading-text="$t('公共.批量导入弹框/蒙版提示')"
    :visible.sync="visible"
    width="600px"
    :show-close="false"
  >
    <div class="import-upload__body">
      <template v-if="!importResult">
        <div class="import-upload__form-item">
          <div style="display: inline-block;line-height: 1;padding: 8px 0;margin-right: 4px">
            {{ $t("公共.批量导入弹框/模板示例文件") }}:
          </div>
          <el-link @click="handleDownloadTpl" :underline="false" target="_blank">
            <el-button type="text">
              {{ templateName }}
            </el-button>
          </el-link>
        </div>
        <div class="import-upload__limit-tip">
          {{ $t("公共.上传控件/上传附件提示", [fileType, maxSize]) }}
        </div>

        <el-form label-width="0px" :model="formModel" ref="form">
          <el-form-item prop="file" :rules="rules" ref="formItem">
            <el-input class="import-upload__file" readonly :value="file && file.name" prop="file"></el-input>
            <el-button class="import-upload__btn" :disabled="uploading" @click="$refs.input.click()">
              {{ $t("公共.批量导入弹框/选择文件") }}
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <!--      <template v-if="uploading">-->
      <!--        <div class="import-upload__form-item">正在上传: {{ file && file.name }}</div>-->
      <!--        <el-progress :text-inside="true" :stroke-width="24" :percentage="uploadPercentage"></el-progress>-->
      <!--      </template>-->
      <template v-if="importResult && importResult.success">
        <div class="import-upload__result">
          <div class="import-upload__result-success">
            {{ $t("资料.资料/原料查看/批量导入弹框/导入成功") }}:
            <span class="import-upload__result-success-count">
              {{ importResult && importResult.data.succeededCount }} {{ $t("资料.资料/原料查看/批量导入弹框/条") }}
            </span>
          </div>
          <div class="import-upload__result-ignore">
            {{ $t("资料.资料/原料查看/批量导入弹框/导入忽略") }}:
            <span class="import-upload__result-ignore-count">
              {{ importResult && importResult.data.ignoredCount }} {{ $t("资料.资料/原料查看/批量导入弹框/条") }}
            </span>
          </div>
          <div class="import-upload__result-fail">
            {{ $t("资料.资料/原料查看/批量导入弹框/导入失败") }}:
            <span class="import-upload__result-fail-count">
              {{ importResult && importResult.data.failedCount }} {{ $t("资料.资料/原料查看/批量导入弹框/条") }}
            </span>
          </div>
        </div>
      </template>
      <div v-if="importResult && !importResult.success" class="import-upload__result">
        <!-- 上传失败 -->
        {{ importResult.message }}
      </div>
    </div>

    <input type="file" style="display:none;" ref="input" @change="handleFileSelected($event)" />
    <div slot="footer" class="dialog-footer">
      <template v-if="importResult && importResult.success">
        <el-button type="primary" @click="downloadResult">{{
          $t("资料.资料/原料查看/批量导入弹框/按钮/确定并下载导入结果")
        }}</el-button>
        <el-button type="primary" @click="doConfirm">{{ $t("公共.模态框按钮/确定按钮") }}</el-button>
      </template>
      <template v-if="importResult && !importResult.success">
        <el-button type="primary" @click="controller.cancel()">{{
          $t("资料.资料/原料查看/批量导入弹框/按钮/知道了")
        }}</el-button>
      </template>
      <template v-if="!importResult">
        <el-button @click="controller.cancel()">{{ $t("公共.模态框按钮/取消按钮") }}</el-button>
        <el-button :disabled="!file" type="primary" :loading="uploading" @click="doUpload()">{{
          $t("资料.资料/原料查看/批量导入弹框/按钮/确定导入")
        }}</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./ImportUpload.ts"></script>
<style lang="scss">
.import-upload {
  .el-dialog__body {
    padding: 20px 32px;
  }

  &__form-item {
    line-height: $--font-line-height-secondary;
    align-items: center;
    display: flex;
  }

  &__limit-tip {
    padding: 7px 0;
    line-height: $--font-line-height-secondary;
    color: $--color-text-secondary;
  }

  &__file {
    width: 400px !important;
    margin-right: 12px;
  }

  &__result {
    margin-left: 81px;

    &-success {
      height: 24px;
      margin-bottom: 8px;
      color: #79879e;
      display: flex;

      &-count {
        margin-left: 12px;
        color: $--color-success;
      }
    }

    &-fail {
      height: 24px;
      margin-bottom: 8px;
      color: #79879e;
      float: left;
      display: flex;
      align-items: center;

      &-count {
        display: flex;
        align-items: center;
        margin-left: 12px;
        color: $--color-danger;
      }

      .download-icon {
        margin-left: 10px;
        color: $--color-primary;
      }
    }

    &-ignore {
      height: 24px;
      margin-bottom: 8px;
      color: #79879e;
      display: flex;

      &-count {
        margin-left: 12px;
      }
    }
  }
}
</style>
