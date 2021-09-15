<template>
  <div class="wz-search-tag">
    <div class="wz-search-tag-text">
      <slot>
        <span></span>
      </slot>
    </div>
    <div class="wz-search-tag-icon" @click="onClose($event)">
      <el-icon class="el-icon-circle-close"></el-icon>
    </div>
  </div>
</template>

<script type="text/babel">
import Emitter from "fant-ui/lib/mixins/emitter";

export default {
  mixins: [Emitter],

  name: "WzSearchTag",
  componentName: "WzSearchTag",

  inject: ["select"],

  props: {
    value: {
      required: true,
    },
    label: [String, Number],
  },

  data() {
    return {
      selected: false,
    };
  },

  computed: {
    currentTag() {
      return this.label || (this.isObject ? "" : this.value);
    },
  },

  methods: {
    onClose(e) {
      e.preventDefault();
      this.$emit("close");
      return false;
    },
  },
};
</script>

<style lang="scss" src="./search.scss"></style>
