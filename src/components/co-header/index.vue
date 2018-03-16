<template>
<div class="header__wrap">
	<header class="header">
    <div class="header__left center">
      <img @click="backHandle" class="header__icon" src="./back.png" alt="">
    </div>
    <div class="header__center center">
      <img class="header__icon" src="./logo.png" alt="">
    </div>
    <div @click.stop.prevent="droplistShow=!droplistShow" class="header__right center">
      <img class="header__icon" src="./people.png" alt="">
    </div>
  </header>
  <div v-show="droplistShow" class="droplist__layer"></div>
    <transition name="drop">
          <ul class="header__droplist" v-show="droplistShow">
            <li class="droplist__userinfo">
              <img class="droplist__userinfo__avatar" src="./11_03.png" alt="">
              <ul v-if="userInfo" class="droplist__userinfo__info">
                <li class="droplist__userinfo__name">{{userInfo.name}}</li>
                <li class="droplist__userinfo__store">{{userInfo.space}}</li>
              </ul>
            </li>
            <li class="droplist__link">
              <img src="./11_06.png" alt="">
              <a  @click="droplistShow=false" href="../per_mobile/index.html">账户设置</a>
            </li>
            <li class="droplist__link">
              <img src="./11_09.png" alt="">
              <a  @click="droplistShow=false" href="../helpcenter_mobile/index.html">帮助中心</a>
            </li>
            <li class="droplist__link">
              <img src="./11_11.png" alt="">
              <a @click="droplistShow=false" href="https://www.rayplus.net/reg_mobile/legal_agreement_mobile.html">服务协议</a>
            </li>
            <li class="droplist__link">
              <img src="./11_12.png" alt="">
              <a @click="droplistShow=false" href="https://www.rayplus.net/outside/logout.php">退出登录</a>
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
      droplistShow: false
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
.header {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 12;
  width: 100%;
  height: 88px;
  background: rgba(49, 90, 140, 0.95);
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;

  &__icon {
    max-height: 46px;
    width: auto;
    padding: 0 20px;
  }
  &__left {
  }
  &__right {
    position: relative;
    cursor: pointer;
  }
  &__droplist {
    position: fixed;
    right: 30px;
    top: 88px;
    z-index: 11;
    height: 474px;
    width: 296px;
    color: #4ebafe;
    padding-left: 26px;
    padding-top: 25px;
    border-radius: 0 0 16px 16px;
    background-color: rgba(49, 90, 140, 0.8);

    .droplist {
      &__userinfo {
        display: flex;
        flex-flow: row nowrap;
        padding-bottom: 34px;
        &__avatar {
          height: 70px;
          width: 70px;
          margin-right: 14px;
        }

        &__info {
          font-size: 28px;
          line-height: 40px;
        }
        &__name {
          color: #fff;
        }
        &__store {
        }
      }
      &__link {
        float: left;
        width: 100%;
        font-size: 30px;
        line-height: 50px;
        overflow: hidden;
        margin: 15px 0;
        cursor: pointer;
        a {
          color: #4ebafe;
          &:hover {
            text-decoration: none;
          }
        }
        img {
          height: 30px;
          width: 50px;
          padding-right: 20px;
          vertical-align: middle;
        }
      }
    }
  }
}

.droplist__layer {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}

.drop-enter-active,
.drop-leave-active {
  transition: all 1s;
}
.drop-enter,
.drop-leave-to {
  opacity: 0;
}
.drop-enter {
  transform: translateY(-100%);
}
.drop-leave-active {
  transform: translateY(-100%);
}
</style>