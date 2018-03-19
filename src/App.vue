<template>
  <div id="app">
    <co-header :userInfo="userInfo" @backHandle="backHandle"></co-header>
    <co-study v-if="oPatients" ref="studyRef"  @seriesActive="seriesActive" :oPatients="oPatients"></co-study>
    <transition name="slideright">
      <co-series v-if="seriesShow"  @getCurseries="_getCurseries" :oSeries="oSeries"></co-series>
    </transition>
      <co-images v-if="curSeries" :userInfo="userInfo" @imageShow="imageShow" :studyActive="studyActive" :curSeries="curSeries" :imgIY="imgIY"></co-images>
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
import CoImages from "@/components/co-images";
import { login, getUserStatus, getData, mGetData, checkStatus } from "@/api";
import { userAgent, IsPC } from "@/util/tool";
import store from "store";

export default {
  name: "app",
  components: {
    CoHeader,
    CoSeries,
    CoStudy,
    CoLayer,
    CoImages
  },
  created() {
    if (IsPC()) {
      var url_01 = window.location.href;
      var para = url_01.split("?")[1];
      if (para != null) window.location.href = "../datalist/index.html?" + para;
      else window.location.href = "../datalist/index.html";
    }
    if (!userAgent()) {
      this.isShow = true;
    }
    this._initData();
  },
  data() {
    return {
      userInfo: null,
      isShow: false,
      oPatients: null,
      seriesShow: false,
      oSeries: null,
      curSeries: null,
      imgIY: null,
      studyActive: null,
      msgShow: true,
      message: ""
    };
  },
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

      if (this.oSeries) {
        this.seriesShow = false;
        this.oSeries = null;
        store.set("activeGroup");
      } else {
        window.location.href = "https://www.rayplus.net/login/index.html";
      }
    },
    gotoLogin() {
      // 失败就重新登陆
      window.location.href = "https://www.rayplus.net/login/index.html";
    },
    changeLayerType(res) {
      return;
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
              space: used + "G/" + space + "G",
              userStatus: res.userStatus
            };
            resolve(res);
          }
        });
      });
    },
    _getData() {
      // 获取数据
      return new Promise((resolve, reject) => {
        getData().then(res => {
          if (res.code && res.code == 1) {
            this.oPatients = res.patients;
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    _getCurseries(series, seriesId) {
      // 根据series 去获取图片信息
      mGetData({ seriesId }).then(res => {
        if (res.code == 1) {
          this.imgIY = res.IY;
          this.curSeries = series;
        } else {
          // 如果未获取
          this.$message({
            message: "获取信息失败",
            type: "error",
            durtion: 3e6
          });
        }
      });
    },
    _active() {
      let activeGroup = store.get("activeGroup");
      this.oPatients.forEach(x => {
        x.studies.forEach(y => {
          if (y.id == activeGroup.STUDYID) {
            y.series.forEach(z => {
              if (z.id == activeGroup.SID) {
                // 此时说明有活动页 active变为ture
                let s = store.get("activeGroup");
                s.ACTIVE = true;
                store.set("activeGroup", s);
                this.seriesActive(y.series, x.id);
              }
            });
          }
        });
      });
    },
    _initData() {
      // 初始化数据
      this._login()
        .then(() => {
          // 登陆成功
          this._getUserStatus()
            .then(res => {
              // 获取用户状态
              this._getData()
                .then(() => {
                  // 数据获取成功 检测是否有activeGroup
                  this._active();
                })
                .catch(() => {
                  // this.gotoLogin();
                });
            })
            .catch(err => {
              // 获取用户状态失败
              this.gotoLogin();
            });
        })
        .catch(() => {
          // 登陆不成功
          this.$message({
            message: "登录失败",
            type: "error",
            durtion: 3e6
          });
        });
    },
    seriesActive(series, studyActive) {
      this.seriesShow = true;
      this.oSeries = series;
      this.studyActive = studyActive;
      this.updateArr = [];
      series.forEach(el => {
        // 如果不等于5 表示还有series在processing中 所以需要定时更新数据
        if (el.processingStatus != 5) {
          this.updateArr.push(el);
        }
      });
      if (this.updateArr.length) {
        for (var i = 0, len = this.updateArr.length; i < len; i++) {
          this._checkStatus(this.updateArr[i]);
        }
      }
    },
    _checkStatus(series) {
      setTimeout(() => {
        checkStatus({ seriesid: series.id }).then(res => {
          if (res.r > 2) {
            // 如果大于2 表示数据已经更新 这个时候更新数据
            this._initData();
          } else {
            this._checkStatus(series);
          }
        });
      }, 3e4);
    },
    imageShow(flag) {
      // 图层的显示和隐藏
      if (!flag) {
        // 首先删除传给子模块的数据
        this.curSeries = null;
      }
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
  transition: all .6s;
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


