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
  <div v-show="droplistShow" @click.stop.prevent="droplistShow=false" class="droplist__layer"></div>
    <transition name="drop">
          <ul class="header__droplist" v-show="droplistShow">
            <li class="droplist__userinfo">
              <img class="droplist__userinfo__avatar" src="./images/11_03.png" alt="">
              <ul v-if="userInfo" class="droplist__userinfo__info">
                <li class="droplist__userinfo__name">{{userInfo.name}}</li>
                <li class="droplist__userinfo__store">{{userInfo.space}}</li>
              </ul>
            </li>
            <li class="droplist__link">
              <img src="./images/11_06.png" alt="">
              <a href="../per_mobile/index.html">账户设置</a>
            </li>
            <li  class="droplist__link">
              <img src="./images/11_09.png" alt="">
              <a href="../helpcenter_mobile/index.html">帮助中心</a>
            </li>
            <li class="droplist__link">
              <img src="./images/11_11.png" alt="">
              <a href="https://www.rayplus.net/reg_mobile/legal_agreement_mobile.html">服务协议</a>
            </li>
            <li  class="droplist__link">
              <img src="./images/11_12.png" alt="">
              <a href="https://www.rayplus.net/outside/logout.php">退出登录</a>
            </li>
        </ul>
    </transition>
</div>

</template>

<script>
import { getUserStatus, login } from "@/api";
export default {
  name: "co-header",
  data() {
    return {
      droplistShow: false,
      userInfo: { name: "未知", space: "0G / 0G" },
      dropTouchActiveId: null
    };
  },
  created() {
    // let data = {
    //   string: "user3",
    //   password: 123456
    // };
    // login(data).then(res => {
    //   let code = res.code;
    //   if (code == 1) {
    //     this._getUserStatus();
    //   } else {
    //   }
    // });
     this._getUserStatus();
  },
  methods: {
    _getUserStatus() {
      getUserStatus().then(res => {
        let code = res.code;
        if (code == 27) {
          this.$emit("getUserStatus", false);
        } else {
          let space = res.space;
          let used = Math.ceil(Number(res.used) * 100) / 100;
          this.userInfo = {
            name: res.username,
            space: used + "G/" + space + "G",
            userStatus: res.userStatus
          };
          this.$emit("getUserStatus", true, this.userInfo);
        }
      });
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