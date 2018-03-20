<template>
  <div id="app">
    <co-header @getUserStatus="_initData" @backHandle="backHandle"></co-header>
    <co-study v-if="oPatients" ref="studyRef"  @seriesActive="seriesActive" :oPatients="oPatients"></co-study>
    <transition name="slideright">
      <co-series v-if="seriesShow"  @getCurseries="_getCurseries" :oSeries="oSeries"></co-series>
    </transition>
    <co-images v-if="curSeries" :userInfo="userInfo" @imageShow="imageShow" :studyActive="studyActive" :curSeries="curSeries" :imgIY="imgIY"></co-images>
  </div>
</template>

<script>
import CoHeader from "@/components/co-header";
import CoSeries from "@/components/co-series";
import CoStudy from "@/components/co-study";
import CoImages from "@/components/co-images";
import { login, getData, mGetData } from "@/api";
import { userAgent, IsPC } from "@/util/tool";
import store from "store";

export default {
  name: "app",
  components: {
    CoHeader,
    CoSeries,
    CoStudy,
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
      this.$message({
        message: ["为了更好的体验，", "建议您使用Chrome浏览器进入本系统"]
      });
    }
    // eruda.init();
  },
  data() {
    return {
      userInfo: null,
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
    _getData() {
      // 获取数据
      return new Promise((resolve, reject) => {
        getData().then(res => {
          if (res.code && res.code == 1) {
            this.oPatients = res.patients;
            resolve(res);
          } else {
            reject();
          }
        });
      });
    },
    _getCurseries(series, seriesId) {
      // 此时表示已经完成
      // 根据series 去获取图片信息
      mGetData({ seriesId }).then(res => {
        if (res.code == 1) {
          this.imgIY = res.IY;
          this.curSeries = series;
        } else {
          // 如果未获取
          this.$message({
            message: "数据获取失败",
            durtion: 3e3
          });
        }
      });
    },
    _active() {
      let activeGroup = store.get("activeGroup");
      if (activeGroup) {
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
      }
    },
    _initData(flag, userInfo) {
      // flag表示登录是否成功
      if (flag) {
        this.userInfo = userInfo;
        // 获取用户状态
        this._getData()
          .then(() => {
            // 数据获取成功 检测是否有activeGroup
            this._active();
          })
          .catch(() => {
            this.gotoLogin();
          });
      } else {
        this.$message({
          message: "数据请求失败",
          durtion: 1e8
        });
        this.gotoLogin();
      }
    },
    seriesActive(series, studyActive) {
      this.seriesShow = true;
      this.oSeries = series;
      this.studyActive = studyActive;
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
  width: 100%;
  overflow: hidden;
}
#app {
  height: 100%;
  overflow: hidden;
}

.slideleft-enter-active,
.slideleft-leave-active,
.slideright-enter-active,
.slideright-leave-active {
  transition: all 0.4s;
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
  transform: translateX(+100%);
}
.slideleft-enter {
  transform: translateX(-100%);
}
.slideleft-leave-active {
  transform: translateX(+100%);
}
</style>


