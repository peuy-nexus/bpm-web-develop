<template>
  <li
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    class="el-select-dropdown__item wz-search-dropdown__item"
    v-show="visible"
    :class="{
      hover: select.hoverIndex === lineNo,
      selectedRows: itemSelected,
      'is-disabled': disabled || groupDisabled,
    }"
    @keydown.down.stop.prevent="navigateOptions('next')"
    @keydown.up.stop.prevent="navigateOptions('prev')"
    @keydown.enter.prevent="selectOption"
    @keydown.esc.stop.prevent="expand = false"
  >
    <slot>
      <span class="wz-search-dropdown__item-label">{{ currentLabel }}</span>
    </slot>
    <span v-if="itemSelected && select.multiple">√</span>
  </li>
</template>

<script type="text/babel">
import Emitter from "fant-ui/lib/mixins/emitter";
import { getValueByPath } from "fant-ui/lib/utils/util";

export default {
  mixins: [Emitter],
  name: "WzSearchOption",
  componentName: "WzSearchOption",

  inject: ["select"],

  props: {
    lineNo: Number,
    value: {
      required: true,
    },
    label: [String, Number],
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover: false,
    };
  },
  watch: {},
  computed: {
    isObject() {
      return Object.prototype.toString.call(this.value).toLowerCase() === "[object object]";
    },

    currentLabel() {
      return this.label || (this.isObject ? "" : this.value);
    },

    itemSelected() {
      if (!this.select.multiple) {
        return this.isEqual(this.select.value, this.value);
      } else {
        return this.contains(this.select.value, this.value);
      }
    },
  },

  methods: {
    isEqual(a, b) {
      if (!this.isObject) {
        return a === b;
      } else {
        return this.select.getValueKey(a) === this.select.getValueKey(b);
      }
    },

    contains(arr = [], target) {
      if (!this.isObject) {
        return arr && arr.indexOf(target) > -1;
      } else {
        return (
          arr &&
          arr.some(item => {
            return this.select.getValueKey(item) === this.select.getValueKey(target);
          })
        );
      }
    },

    hoverItem() {
      if (!this.disabled && !this.groupDisabled) {
        this.select.hoverIndex = this.lineNo;
      }
    },

    selectOptionClick() {
      if (this.disabled !== true && this.groupDisabled !== true) {
        this.dispatch("WzSearch", "handleOptionClick", [this, true]);
      }
    },
    navigateOptions(field) {
      this.$parent.navigateOptions(field);
    },
  },
};
</script>
<style lang="scss" src="./search.scss"></style>
