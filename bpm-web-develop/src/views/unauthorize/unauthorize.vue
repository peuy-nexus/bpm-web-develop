<template>
  <div class="unauthorized-page">
    <div class="unauthorized-page__content">
      <img src="@/assets/img/unauthorize/unauthorized-logo.png" alt="" />
      <div class="unauthorized-page__tip">{{ $t("公共.无许可证页面/提示") }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "unauthorize",
  data() {
    return {
      fitMode: "height",
    };
  },
  mounted() {
    const height = window.screen.height;
    const width = window.screen.width;
    if (width >= height) {
      this.fitMode = "height";
    } else {
      this.fitMode = "width";
    }
  },
};
</script>

<style scoped lang="scss">
.unauthorized-page {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-size: cover;
  border-radius: 4px;

  &__tip {
    text-align: center;
    margin-top: 30px;
    font-size: 20px;
    line-height: 24px;
    font-weight: $--font-weight-bold;
  }
}
</style>
