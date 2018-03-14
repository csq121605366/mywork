<template>
  <section class="layer" v-show="show" @click.prevent.stop="changeType">
      <div class="layer__info">
          <!-- <p>为了更好的体验，</p>
          <p>建议您使用Chrome浏览器进入本系统</p> -->
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
.layer {
  position: fixed;
  height: 100%;
  width: 100%;
  padding: 0 40px;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  &__info {
    height: 178px;
    flex: 1;
    border: 2px solid #fff;
    border-radius: 10px;
    text-align: center;
    color: #fff;
    font-size: 30px;
    line-height: 50px;
    padding-top: 38px;
  }
}
</style>
