<template>
  <section class="message" v-show="show">
    <div class="message__info">
      <p>{{message}}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: "v-message",
  mounted() {
    this.StartTime();
  },
  data() {
    return {
      message: "",
      show: false,
      timer: null,
      durtion: 3e3
    };
  },
  methods: {
    StartTime() {
      this.show = true;
      if (this.timer) {
        clearTimeOut(this.timer);
      } else {
        this.timer = setTimeout(() => {
          this.show = false;
        }, this.durtion);
      }
    }
  }
};
</script>

<style lang="scss">
.message {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 88px 40px 0;
  left: 0;
  top: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0);
  &__info {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: 180px;
    width: 610px;
    background-color: rgba(49, 90, 140, 0.8);
    border-radius: 10px;
    text-align: center;
    color: #fff;
    font-size: 30px;
    line-height: 50px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    &.error {
      background-color: #f56c6c;
    }
    &.warning {
      background-color: #e6a23c;
    }
    &.success {
      background-color: #67c23a;
    }
    &.info {
      background: #909399;
    }
  }
}
</style>
