<template>
<div class="header">
	<header class="header__wrap">
    <div @click="backHandle" class="header__left center">
      <img  class="header__icon" src="./images/back.png" alt="">
    </div>
    <div class="header__center center">
      <img class="header__icon" src="./images/logo.png" alt="">
    </div>
    <div @click.stop.prevent="droplistShow=!droplistShow" class="header__right center">
      <img class="header__icon" src="./images/people.png" alt="">
    </div>
  </header>
  <div v-show="droplistShow" class="droplist__layer"></div>
    <transition name="drop">
          <ul class="header__droplist" v-show="droplistShow">
            <li class="droplist__userinfo">
              <img class="droplist__userinfo__avatar" src="./images/11_03.png" alt="">
              <ul v-if="userInfo" class="droplist__userinfo__info">
                <li class="droplist__userinfo__name">{{userInfo.name}}</li>
                <li class="droplist__userinfo__store">{{userInfo.space}}</li>
              </ul>
            </li>
            <li @touchstart.capture="droplistTouchStart('link1')" @touchend.capture="droplistTouchEnd('link1')" :class="dropTouchActiveId=='link1'?'active':''" class="droplist__link">
              <img src="./images/11_06.png" alt="">
              <a  @click.self="droplistShow=false" href="../per_mobile/index.html">账户设置</a>
            </li>
            <li @touchstart.capture="droplistTouchStart('link2')" @touchend.capture="droplistTouchEnd('link3')" :class="dropTouchActiveId=='link2'?'active':''" class="droplist__link">
              <img src="./images/11_09.png" alt="">
              <a  @click="droplistShow=false" href="../helpcenter_mobile/index.html">帮助中心</a>
            </li>
            <li @touchstart.capture="droplistTouchStart('link3')" @touchend.capture="droplistTouchEnd('link3')" :class="dropTouchActiveId=='link3'?'active':''" class="droplist__link">
              <img src="./images/11_11.png" alt="">
              <a @click="droplistShow=false" href="https://www.rayplus.net/reg_mobile/legal_agreement_mobile.html">服务协议</a>
            </li>
            <li @touchstart.capture="droplistTouchStart('link4')" @touchend.capture="droplistTouchEnd('link4')" :class="dropTouchActiveId=='link4'?'active':''" class="droplist__link">
              <img src="./images/11_12.png" alt="">
              <a @click.prevent="droplistShow=false" href="https://www.rayplus.net/outside/logout.php">退出登录</a>
            </li>
        </ul>
    </transition>
</div>

</template>

<script>
export default {
  name: "co-header",
  props: {
    userInfo: {
      type: [Object],
      default: { name: "未知", space: "0G / 0G" }
    }
  },
  data() {
    return {
      droplistShow: false,
      info: "",
      dropTouchActiveId: null
    };
  },
  watch: {
    droplistShow(flag) {
      if (this.droplistShow) {
        document.addEventListener("click", this.closeDropList);
      } else {
        document.removeEventListener("click", this.closeDropList);
      }
    }
  },
  methods: {
    droplistTouchStart(e) {
      this.dropTouchActiveId = e;
    },
    droplistTouchEnd(e) {
      this.dropTouchActiveId = null;
    },
    backHandle() {
      this.$emit("backHandle");
    },
    closeDropList(e) {
      if (e.target.className == "droplist__layer") {
        this.droplistShow = false;
      }
    }
  }
};
</script>

<style lang='scss'>
@import "~./css/index.scss";

</style>