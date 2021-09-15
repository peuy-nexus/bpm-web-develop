<template>
  <div class="unauthorized-page">
    <div class="unauthorized-page__content">
      <img src="@/assets/img/not-found/not-found.png" alt="" />
      <div class="unauthorized-page__tip">{{ $t("公共.页面/404页面提示语") }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
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
