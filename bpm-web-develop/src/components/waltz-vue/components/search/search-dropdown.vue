<template>
  <div
    class="el-select-dropdown el-popper"
    :class="[{ 'is-multiple': $parent.multiple }, popperClass]"
    :style="{ minWidth: '300px' }"
  >
    <slot></slot>
  </div>
</template>

<script type="text/babel">
import Popper from "fant-ui/lib/utils/vue-popper";

export default {
  name: "WzSearchDropdown",

  componentName: "WzSearchDropdown",

  mixins: [Popper],

  props: {
    placement: {
      default: "bottom-start",
    },

    boundariesPadding: {
      default: 0,
    },

    popperOptions: {
      default() {
        return {
          gpuAcceleration: false,
        };
      },
    },

    visibleArrow: {
      default: true,
    },

    appendToBody: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    popperClass() {
      return this.$parent.popperClass;
    },
  },

  mounted() {
    this.referenceElm = this.$parent.$refs.reference;
    this.$parent.popperElm = this.popperElm = this.$el;
    this.$on("updatePopper", () => {
      if (this.$parent.expand) {
        this.updatePopper();
      }
    });
    this.$on("destroyPopper", this.destroyPopper);
  },
};
</script>

<style lang="scss" src="./search.scss"></style>
