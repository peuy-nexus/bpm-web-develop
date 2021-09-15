<template>
  <div class="wz-search el-select" :class="{ 'is-expand': expand }" @click.stop="toggleMenu" v-clickoutside="blur">
    <div
      class="el-input"
      :class="[
        selectSize ? 'el-select--' + selectSize : '',
        isActive ? 'is-active' : '',
        singleLabel ? 'has-value' : '',
        disabled ? 'is-disabled' : '',
      ]"
    >
      <div
        class="el-input__inner el-input--suffix"
        :class="{
          'el-input__inner-multiple': multiple,
        }"
        ref="reference"
        :tabindex="0"
        @mouseenter="inputHovering = true"
        @mouseleave="inputHovering = false"
      >
        <div class="wz-search__placeholder" v-if="!queryable" v-show="valueList.length === 0 && !queryText">
          {{ placeholder }}
        </div>
        <div
          v-if="!multiple"
          :class="[expand ? 'wz-search__placeholder' : 'wz-search__single-value']"
          v-show="valueList.length && !queryText"
        >
          {{ singleLabel }}
        </div>
        <template v-if="multiple">
          <wz-search-tag
            :value="item"
            v-for="(item, index) in valueList"
            @close="doUnselect($event, item)"
            :key="index"
          >
            {{ getValueLabel(item) || item }}
          </wz-search-tag>
        </template>
        <input
          :id="id"
          :name="name"
          v-model="queryText"
          class="wz-search__input"
          :class="{ 'is-focus': isActive }"
          :style="{ width: inputWidth + 20 + 'px' }"
          :tabindex="-1"
          ref="input"
          v-if="queryable"
          :placeholder="valueList.length === 0 && placeholder"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown.down.stop.prevent="navigateOptions('next')"
          @keydown.up.stop.prevent="navigateOptions('prev')"
          @keydown.enter.prevent="selectOption"
          @keydown.esc.stop.prevent="expand = false"
          @keydown.tab="expand = false"
          :disabled="disabled"
        />

        <span v-if="queryable" ref="inputGhost" class="wz-search__input-ghost">{{ queryText }}</span>
        <span class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <i :class="['el-select__caret', 'el-input__icon', 'el-icon-' + inputIconClass]"></i>
            <i v-if="showClose" class="el-input__icon iconfont ic-ui-clean" @click="handleClearClick"></i>
          </span>
        </span>
      </div>
    </div>
    <transition name="el-zoom-in-top" @before-enter="handleMenuEnter" @after-leave="doDestroyPopper">
      <wz-search-dropdown
        ref="popper"
        :append-to-body="popperAppendToBody"
        v-show="expand"
        :style="{ width: clientWidth + 'px' }"
      >
        <wz-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          v-show="options.length > 0"
          :v-infinite-scroll="loadMore"
          :infinite-scroll-disabled="!hasMore || !!loading"
        >
          <slot>
            <wz-search-option
              v-for="(record, index) in options"
              :key="index"
              :line-no="index"
              :label="getValueLabel(record)"
              :value="record"
              ref="scrollOption"
            ></wz-search-option>
          </slot>
        </wz-scrollbar>
        <slot name="loading" v-if="loading">
          <p
            class="el-select-dropdown__empty el-select-dropdown__loading"
            :class="{ 'el-select-dropdown__loading-more': options.length }"
          >
            <i class="el-icon-loading" />{{ loadingText || t("el.select.loading") }}
          </p>
        </slot>
        <slot name="empty" v-else-if="options.length === 0">
          <p class="el-select-dropdown__empty">
            {{ noDataText || t("el.select.noData") }}
          </p>
        </slot>
      </wz-search-dropdown>
    </transition>
  </div>
</template>

<script type="text/babel">
import debounce from "throttle-debounce/debounce";
import { t } from "fant-ui/lib/locale";
import { getValueByPath, valueEquals } from "fant-ui/lib/utils/util";
import Focus from "fant-ui/lib/mixins/focus";
import Emitter from "fant-ui/lib/mixins/emitter";
import Locale from "fant-ui/lib/mixins/locale";
import Clickoutside from "fant-ui/lib/utils/clickoutside";
import { addResizeListener, removeResizeListener } from "fant-ui/lib/utils/resize-event";
import WzSearchDropdown from "./search-dropdown";
import WzSearchTag from "./search-tag";
import WzSearchOption from "./search-option";
import scrollIntoView from "fant-ui/lib/utils/scroll-into-view";
import NavigationMixin from "./NavigationMixin";
import { ROUND_UP } from "../../utils/RoundingMode";

export default {
  mixins: [Emitter, Locale, Focus("reference"), NavigationMixin],
  name: "WzSearch",
  componentName: "WzSearch",
  components: {
    WzSearchDropdown,
    WzSearchTag,
    WzSearchOption,
  },
  directives: { Clickoutside },
  inject: {
    elForm: {
      default: "",
    },
    elFormItem: {
      default: "",
    },
  },

  provide() {
    return {
      select: this,
    };
  },

  props: {
    name: String,
    id: String,
    value: {
      required: true,
    },
    valueKey: {
      type: [String, Function],
      required: true,
    },
    valueLabel: {
      type: [String, Function],
      required: true,
    },
    size: String,
    disabled: Boolean,
    readonly: Boolean,
    clearable: Boolean,
    pageSize: {
      type: Number,
      default: 10,
    },
    whole: Boolean,
    queryable: {
      type: Boolean,
      default: true,
    },
    popperClass: String,
    /**
     * 远端查询服务。返回 QueryResult {page, pageSize, recordCount, options}
     */
    queryMethod: {
      type: Function,
      required: true,
    },
    loadingText: String,
    noDataText: String,
    placeholder: {
      type: String,
      default() {
        return t("el.select.placeholder");
      },
    },
    // 模糊查询，默认true。设置为false时，只有精确根据输入key搜索结果自动选择。
    fuzzyQuery: {
      type: Boolean,
      default: true,
    },
    debounceTime: {
      type: Number,
      default: 300,
    },
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0,
    },
    collapseTags: Boolean,
    // 在输入框按下回车，选择第一个匹配项。
    defaultFirstOption: Boolean,
    // 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
    reserveKeyword: Boolean,
    // 未搜索前，是否展开。默认展开
    automaticDropdown: {
      type: Boolean,
      default: true,
    },
    popperAppendToBody: {
      type: Boolean,
      default: true,
    },
    excludeIds: Array,
    allowCreate: Boolean,
    type: String,
  },

  data() {
    return {
      options: [],
      expand: false,
      isActive: false,
      loading: false,
      queryText: "",
      pageCount: 0,
      paging: {
        page: 0,
      },
      hoverIndex: -1,
      previousQuery: null,
      inputHovering: false,
      clientWidth: 120,
      inputWidth: 10,
      currentPlaceholder: "",
      menuExpandOnFocus: false,
      isOnComposition: false,
      isSilentBlur: false,
      labelFn: null,
      keyFn: null,
      localValue: this.value,
    };
  },

  computed: {
    optionsAllDisabled() {
      return this.options.every(option => option.deleted);
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },

    valueList() {
      if (this.value === null || this.value === undefined) {
        return [];
      } else if (Array.isArray(this.value)) {
        return this.value;
      }
      return [this.value];
    },

    singleLabel() {
      return this.value ? this.getValueLabel(this.value) : "";
    },

    showClose() {
      if (!this.clearable || this.disabled || this.multiple) {
        return false;
      }
      if (this.isActive) {
        if (this.queryable) {
          return this.queryText && this.queryText.length;
        }
      }
      return !!this.value;
    },

    inputIconClass() {
      return this.expand ? "arrow-up is-reverse" : "arrow-up";
    },

    selectSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },

    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },

    hasMore() {
      return this.paging.page + 1 < this.pageCount;
    },
  },

  watch: {
    value(val, oldVal) {
      if (!valueEquals(val, oldVal)) {
        if (this.multiple && this.expand && this.$refs.popper) {
          this.$nextTick(() => {
            this.$refs.popper.updatePopper();
          });
        }
        this.dispatch("ElFormItem", "el.form.change", val);
      }
    },

    expand(val) {
      if (!val) {
        this.broadcast("WzSearchDropdown", "destroyPopper");
      } else {
        this.broadcast("WzSearchDropdown", "updatePopper");
      }
      this.$emit("expand-change", val);
    },

    queryText() {
      this.debouncedOnInputChange(this.queryText);
      this.$nextTick(() => {
        this.inputWidth = this.$refs.inputGhost.offsetWidth + 10;
      });
    },

    hoverIndex(val) {
      if (typeof val === "number" && val > -1) {
        this.hoverOption = this.$refs.scrollOption[val] || {};
      }
    },
  },

  created() {
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit("input", []);
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit("input", "");
    }

    this.debouncedOnInputChange = debounce(this.debounceTime, keyword => {
      this.queryRecords({ keyword });
    });

    this.$on("handleOptionClick", this.handleOptionSelect);
    if (this.whole) {
      this.queryRecords({});
    }
  },

  mounted() {
    if (this.multiple && Array.isArray(this.value) && this.value && this.value.length > 0) {
      this.currentPlaceholder = "";
    }
    this.handleResize();
    addResizeListener(this.$el, this.handleResize);
  },

  beforeDestroy() {
    if (this.$el && this.handleResize) {
      removeResizeListener(this.$el, this.handleResize);
    }
  },

  methods: {
    getValueKey(value) {
      if (typeof this.valueKey === "string") {
        return getValueByPath(value, this.valueKey);
      } else if (typeof this.valueKey === "function") {
        return this.valueKey(value);
      }
    },
    getValueLabel(value) {
      if (typeof this.valueLabel === "string") {
        return getValueByPath(value, this.valueLabel);
      } else if (typeof this.valueLabel === "function") {
        return this.valueLabel(value);
      }
    },

    toggleMenu() {
      if (!this.selectDisabled) {
        this.expand = !this.expand;
        if (this.queryable && this.$refs.input) {
          this.$refs.input[this.expand ? "focus" : "blur"]();
        }
        if (this.fuzzyQuery && !this.whole) {
          this.queryRecords({ page: 0 });
        }
      }
    },

    blur() {
      this.expand = false;
      this.isActive = false;
      this.$refs.reference.blur();
      if (this.queryable) {
        this.queryText = "";
      }
    },

    handleFocus() {
      this.isActive = true;
    },

    handleBlur() {
      this.isActive = false;
    },

    handleResize() {
      this.clientWidth = this.$el.getBoundingClientRect().width;
    },

    handleClearClick(event) {
      event.stopPropagation();
      if (this.queryable) {
        this.queryText = "";
      }

      const value = null;
      this.$emit("input", value);
      this.emitChange(value);
      this.expand = false;
      this.$emit("clear");
    },

    loadMore() {
      this.queryRecords({
        keyword: this.queryText,
        page: this.paging.page + 1,
      });
    },

    queryRecords({ keyword, page = 0 }) {
      if (this.loading) {
        this.loading = false;
      }
      this.loadingMore = page > 0;
      this.loading = this.queryMethod({
        keyword,
        page,
      });
      this.loading
        .then(res => {
          const queryResult = res.data;
          this.loading = false;
          this.paging.page = page;
          this.pageCount = queryResult.pageCount || 0;
          if (page === 0) {
            this.options = queryResult.records || [];
          } else {
            //暂时写法
            const optionList = queryResult.records || [];
            this.options = [...this.options, ...optionList];
          }
          this.$nextTick(() => {
            this.$refs.popper.updatePopper();
          });
        })
        .catch(error => {
          throw error;
        });
    },

    handleMenuEnter() {
      // this.$nextTick(() => this.scrollToOption(this.selectedRows));
    },

    emitChange(val) {
      if (!valueEquals(this.value, val)) {
        this.$emit("change", val);
      }
    },

    doDestroyPopper() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    },

    handleOptionSelect(option) {
      this.$refs.input && this.$refs.input.focus();
      if (this.multiple) {
        if (this.value === null || this.value === undefined) {
          this.$emit("input", [option.value]);
          this.emitChange([option.value]);
        } else if (option.itemSelected) {
          const value = this.value;
          this.remove(value, item => this.getValueKey(option.value) === this.getValueKey(item));
          this.$emit("input", value);
          this.emitChange(value);
        } else {
          if (this.multipleLimit > 0 && this.value.length >= this.multipleLimit) {
            return;
          }
          this.$emit("input", [...this.value, option.value]);
          this.emitChange([...this.value, option.value]);
        }
      } else {
        this.$emit("input", option.value);
        this.emitChange(option.value);
        this.expand = false;
        if (this.queryable) {
          this.queryText = "";
          this.$refs.input.blur();
        }
      }
    },

    selectOption() {
      if (this.allowCreate) {
        this.$emit("create", this.queryText);
      }
      if (!this.expand) {
        this.toggleMenu();
      } else {
        if (this.$refs.scrollOption[this.hoverIndex]) {
          this.handleOptionSelect(this.$refs.scrollOption[this.hoverIndex]);
          this.queryable = false;
          this.queryText = "";
        }
      }
    },

    doUnselect(e, option) {
      const value = this.value;
      const valueFilter = value.filter((item, i) => {
        if (this.getValueLabel(item) !== this.getValueLabel(option)) {
          return item;
        }
      });
      this.expand = true;
      this.$emit("input", valueFilter);
      this.emitChange(valueFilter);
    },
    remove(array, fn, scope) {
      if (!array || !Array.isArray(array)) {
        return;
      }

      for (let i = 0; i < array.length; i++) {
        if (fn.call(scope, array[i], i, array)) {
          array.splice(i--, 1);
        }
      }
    },

    checkDefaultFirstOption() {
      this.hoverIndex = -1;
      // highlight the created option
      let hasCreated = false;
      for (let i = this.options.length - 1; i >= 0; i--) {
        if (this.options[i].created) {
          hasCreated = true;
          this.hoverIndex = i;
          break;
        }
      }
      if (hasCreated) return;
      for (let i = 0; i !== this.options.length; ++i) {
        const option = this.options[i];
        if (this.query) {
          // highlight first options that passes the filter
          if (!option.disabled && !option.groupDisabled && option.expand) {
            this.hoverIndex = i;
            break;
          }
        } else {
          // highlight currently selectedRows option
          if (option.itemSelected) {
            this.hoverIndex = i;
            break;
          }
        }
      }
    },

    scrollToOption(option) {
      //键盘事件，选择区域滚动
      const target =
        Array.isArray(this.$refs.scrollOption) && this.$refs.scrollOption[this.hoverIndex]
          ? this.$refs.scrollOption[this.hoverIndex].$el
          : this.$refs.scrollOption.$el;
      if (this.$refs.popper && target) {
        const menu = this.$refs.popper.$el.querySelector(".el-select-dropdown__wrap");
        scrollIntoView(menu, target);
      }
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll();
    },

    navigateOptions(direction) {
      if (!this.expand) {
        this.expand = true;
        return;
      }
      if (this.options.length === 0) return;
      if (!this.optionsAllDisabled) {
        if (direction === "next") {
          this.hoverIndex++;
          if (this.hoverIndex === this.options.length) {
            this.hoverIndex = 0;
          }
        } else if (direction === "prev") {
          this.hoverIndex--;
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.options.length - 1;
          }
        }
        const option = this.options[this.hoverIndex];
        if (option.disabled === true) {
          this.navigateOptions(direction);
        }
        this.$nextTick(() => this.scrollToOption(this.hoverOption));
      }
    },
  },
};
</script>
<style lang="scss" src="./search.scss"></style>
