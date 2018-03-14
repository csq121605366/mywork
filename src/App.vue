<template>
  <div id="app">
    <co-header @backHandle="backHandle"></co-header>
    <co-study v-if="oPatients.length" ref="studyRef" @cycleLink="cycleLink" @seriesActive="seriesActive" :oPatients="oPatients"></co-study>
    <transition name="slideleft">
      <co-series v-if="seriesShow" :oSeries="oSeries"></co-series>
    </transition>
    <co-layer :isShow="isShow" @changeType="changeLayerType">
      <p>为了更好的体验，</p>
      <p>建议您使用Chrome浏览器进入本系统</p>
    </co-layer>
  </div>
</template>

<script>
import CoHeader from "@/components/co-header";
import CoSeries from "@/components/co-series";
import CoStudy from "@/components/co-study";
import CoLayer from "@/components/co-layer";
import { login, getUserStatus, getData } from "@/api";
import { userAgent } from "@/util/tool";

export default {
  name: "app",
  components: {
    CoHeader,
    CoSeries,
    CoStudy,
    CoLayer
  },
  created() {
    if (!userAgent()) {
      this.isShow = true;
    }
    this._initData();
  },
  data() {
    this.cycleLinkTimer = 2e3;
    return {
      userInfo: null,
      isShow: false,
      oPatients: [],
      seriesShow: false,
      oSeries: null
    };
  },
  watch: {},
  mounted() {},
  methods: {
    backHandle: function() {
      // if (this.seriesList != null) {
      //   this.seriesList = null;
      //   this.oSeriesList = null;
      //   this.searchInput = "";
      // } else {
      //   window.location.href = this.loginUrl;
      // }
      // 重置活动id
      // this.$refs.studyRef.resetActiveId();
      this.seriesShow = false;
    },
    gotoLogin() {
      // 失败就重新登陆
      window.location.href = "https://www.rayplus.net/login/index.html";
    },
    changeLayerType(res) {
      console.log(res);
    },
    _login() {
      return new Promise((resolve, reject) => {
        let data = {
          string: "user3",
          password: 123456
        };
        login(data).then(res => {
          let code = res.code;
          if (code == 1) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    _getUserStatus() {
      return new Promise((resolve, reject) => {
        getUserStatus().then(res => {
          let code = res.code;
          if (code == 27) {
            reject(code);
          } else {
            let space = res.space;
            let used = Math.ceil(Number(res.used) * 100) / 100;
            this.userInfo = {
              name: res.username,
              space: used + "G/" + space + "G"
            };
            resolve(res);
          }
        });
      });
      return;
    },
    _getData() {
      return new Promise((resolve, reject) => {
        getData().then(res => {
          if (res.code && res.code == 1) {
            this.oPatients = res.patients;
            // this.oPatients[0].birth = new Date().getSeconds();
            // console.log(this.oPatients[0].birth);
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    _initData() {
      this._login()
        .then(() => {
          // 登陆成功
          this._getUserStatus()
            .then(res => {
              // 获取用户状态
              this._getData()
                .then(() => {})
                .catch(() => {
                  this.gotoLogin();
                });
            })
            .catch(err => {
              // 获取用户状态失败
              this.gotoLogin();
            });
        })
        .catch(() => {
          // 登陆不成功
          console.log("登陆不成功");
        });
    },
    cycleLink(close = true) {
      if (close) {
        this.timer = setTimeout(() => {
          this._initData();
        }, this.cycleLinkTimer);
      } else if (!close && this.timer) {
        clearInterval(this.timer);
      } else {
        console.error("未启动循环访问接口");
      }
    },
    seriesActive(res) {
      console.log(res);
      this.seriesShow = true;
      this.oSeries = res;
    }
  }
};
</script>

<style lang="scss">
@import "./assets/style/index.scss";
* {
  box-sizing: border-box;
}
html,
body {
  height: 100%;
}
#app {
  height: 100%;
  overflow: hidden;
}

.slideleft-enter-active,
.slideleft-leave-active,
.slideright-enter-active,
.slideright-leave-active {
  transition: all 1s;
}
.slideleft-enter,
.slideleft-leave-to,
.slideright-enter,
.slideright-leave-to {
  opacity: 0;
}
.slideright-enter {
  transform: translateX(+100%);
}
.slideright-leave-active {
  transform: translateX(-100%);
}
.slideleft-enter {
  transform: translateX(-100%);
}
.slideleft-leave-active {
  transform: translateX(+100%);
}
</style>


