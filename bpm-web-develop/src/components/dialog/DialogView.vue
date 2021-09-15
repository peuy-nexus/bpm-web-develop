<template>
  <component :is="currentView" @hide="hide" @show="show" ref="content"></component>
</template>
<script>
export default {
  data() {
    return {
      currentView: null,
      target: document.body,
      closeOnClickModal: false,
    };
  },
  methods: {
    getTarget() {
      if (!this.target) {
        return document.body;
      }
      return this.target;
    },

    show() {
      this.getTarget().appendChild(this.$el);
    },

    canShow() {
      if (this.$refs.content && this.$refs.content.canShow) {
        return this.$refs.content.canShow();
      } else {
        return true;
      }
    },

    hide() {
      this.$emit("hide");
      this.$destroy(true);
    },
  },

  beforeDestroy() {
    if (this.$el.parentElement) {
      this.getTarget().removeChild(this.$el);
    }
  },
};
</script>
