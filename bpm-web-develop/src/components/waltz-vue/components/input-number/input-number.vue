<template>
  <div
    :class="[
      'el-input',
      'wz-input-number',
      {
        'is-disabled': inputDisabled,
        'el-input-group': $slots.prepend || $slots.append,
        'el-input-group--append': $slots.append,
        'el-input-group--prepend': $slots.prepend,
        'el-input--prefix': $slots.prefix || prefixIcon,
        'el-input--suffix': $slots.suffix || suffixIcon || clearable,
      },
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseleave"
  >
    <!-- 前置元素 -->
    <div class="el-input-group__prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>
    <input
      :tabindex="tabindex"
      class="el-input__inner"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly || uneditable"
      :autocomplete="autoComplete"
      :value="inputValue"
      ref="input"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    />
    <!-- 前置内容 -->
    <span class="el-input__prefix " v-if="$slots.prefix || prefixIcon" :style="prefixOffset">
      <slot name="prefix"></slot>
      <i class="el-input__icon" v-if="prefixIcon" :class="prefixIcon"> </i>
    </span>
    <!-- 后置内容 -->
    <span
      :class="['el-input__suffix', 'wz-input-number__suffix ']"
      v-if="$slots.suffix || suffixIcon || suffix || clearable"
      :style="{ right: $slots.append ? '30px' : '5px' }"
    >
      <span class="el-input__suffix-inner">
        <i v-if="showClear" class="el-input__icon el-icon-circle-close el-input__clear" @click="clearValue"></i>
        <template>
          <!--          <slot name="suffix"-->
          <!--            ><span>{{ suffix }}</span></slot-->
          <!--          >-->
        </template>
      </span>
    </span>
    <!-- 后置元素 -->
    <div class="el-input-group__append" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "WzInputNumber",

  componentName: "WzInputNumber",

  inheritAttrs: false,

  inject: {
    elForm: {
      default: "",
    },
    elFormItem: {
      default: "",
    },
  },
  props: {
    value: [String, Number],
    disabled: Boolean,
    autoComplete: {
      type: String,
      default: "off",
    },
    //前置图标，用法：suffix-icon="el-icon-date"
    suffixIcon: String,
    //后置图标：用法与上类似
    prefixIcon: String,
    //输入框关联的label文字
    label: String,
    //是否可清除
    clearable: {
      type: Boolean,
      default: false,
    },
    tabindex: String,
    showDecimals: {
      type: Boolean,
      default: false,
    },
    precision: {
      type: Number,
      default: NaN,
    },
    // 倍率
    magnification: {
      type: Number,
      default: 1,
    },
    suffix: null,
    min: {
      type: Number,
      default: NaN,
    },
    max: {
      type: Number,
      default: 99999999,
    },
    minEqual: {
      type: Boolean,
      default: true,
    },
    maxEqual: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    uneditable: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currentValue: this.value === undefined || this.value === null ? "" : this.value,
      textareaCalcStyle: {},
      prefixOffset: null,
      suffixOffset: null,
      hovering: false,
      focused: false,
      isOnComposition: false,
      valueBeforeComposition: null,
      localData: null,
      showHandler: false,
    };
  },

  computed: {
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    showClear() {
      return (
        this.clearable &&
        !this.disabled &&
        !this.readonly &&
        this.value !== "" &&
        this.value !== undefined &&
        this.value !== null &&
        (this.focused || this.hovering)
      );
    },
    inputValue() {
      if (this.isOnComposition && this.value === this.valueBeforeComposition) return;
      if (this.value !== 0 && !this.value) {
        return "";
      }
      //去空格显示精度优化
      let inputValue =
        this.showDecimals && !isNaN(this.precision) ? this.value.scale(this.precision) : Number(this.value);
      inputValue = inputValue.multiply(this.magnification);
      return inputValue;
    },
  },
  created() {
    this.$on("inputSelect", this.select);
  },
  methods: {
    handleMouseEnter() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.showHandler = true;
      this.hovering = true;
    },
    handleMouseleave() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.showHandler = false;
      }, 100);
      this.hovering = false;
    },
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit("blur", event);
    },
    select() {
      this.$refs.input.select();
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit("focus", event);
    },
    handleInput(event) {
      const value = event.target.value;
    },
    handleChange(event) {
      const inputValue = event.target.value.trim();
      // prevent fire early if decimal. If no more input the change event will fire later
      // 因为val是输入字符串，需要与inputValue进行对比
      if (event.type === "change" && inputValue === this.inputValue) {
        return;
      } // already fired change for input event
      let value = this.ensureInputValue(inputValue);
      if (value === false) {
        event.target.value = this.inputValue;
      } else {
        value = this.ensureValue(value);
        if (value === this.value) {
          event.target.value = value;
        } else if (value === false) {
          this.$emit("input", null);
          this.$nextTick(() => {
            this.dispatch("ElFormItem", "el.form.change", value);
          });
        } else {
          this.$emit("input", value);
          this.$nextTick(() => {
            this.dispatch("ElFormItem", "el.form.change", value);
          });
        }
      }
    },

    ensureInputValue(inputValue) {
      inputValue = inputValue === "" ? null : Number(inputValue);
      if (inputValue === null) {
        return inputValue;
      } else if (!isNaN(inputValue)) {
        inputValue = inputValue.divide(this.magnification, inputValue.scale() + 2);
        return inputValue;
      } // 输入不合法，回写当前值
      return false;
    },
    ensureValue(value) {
      if (value === null || value === undefined) {
        return false;
      }

      value = Number(value);
      if (isNaN(value)) {
        return value;
      }
      // 如果设置了精度。对inputValue进行舍入
      if (!isNaN(this.precision)) {
        value = value.scale(this.precision);
      }

      const { min, max } = this;
      if (value >= max) {
        value = this.maxEqual ? max : this.value || null;
      } else if (value <= min) {
        value = this.minEqual ? min : this.value || null;
      }
      return value;
    },
    clearValue() {
      this.$emit("input", null);
      this.$emit("change", null);
      this.$emit("clear");
      this.dispatch("ElFormItem", "el.form.change", null);
      this.focus();
    },
    dispatch: function dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        // eslint-disable-next-line prefer-spread
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
  },
};
</script>
<style lang="scss">
.wz-input-number {
  &__suffix {
    &-append {
      right: 30px;
    }
  }
}
</style>
