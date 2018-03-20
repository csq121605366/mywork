<template>
  <section @click.stop="show=false" class="message" v-show="show">
    <div class="message__info">
      <p v-if="typeof message=='string'">{{message}}</p>
      <p v-else v-for="(item,i) in message" :key="i">{{item}}</p>
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
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    &.error {
      color: #f56c6c;
    }
    &.warning {
      color: #e6a23c;
    }
    &.success {
      color: #67c23a;
    }
    &.info {
      color: #909399;
    }
  }
}
</style>
