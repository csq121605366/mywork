<template>
  <section class="layer" v-show="show" @click.prevent.stop="changeType">
    <div class="layer__info">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.isShow
    };
  },
  methods: {
    changeType() {
      this.show = !this.show;
      this.$emit("changeType", this.show);
    }
  }
};
</script>

<style lang="scss">
@import './css/index.scss';
</style>
