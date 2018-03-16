<template>
  <section class="imglist">
    <ul v-if="series" class="imglist__content" @click.stop.prevent="showHandle(false)">
      <li class="imglist__item" v-for="i in Math.min(20, series.imageNum)" :key="i">
        <img :src="series.imgBase.substr(0,series.imgBase.length-7)+'IY'+i+'.png'+imgIY[i]" alt="">
      </li>
    </ul>
    <ul class="fnBtns">
      <li class="viewer" @click.stop="_getRead(series.id)"><img src="./viewer.png" alt="">影像诊断</li>
      <li class="vr" @click.stop="_to3D('../3DVR_mobile/index.html')"><img src="./vr.png" alt="">容积重建</li>
      <li class="obj" @click.stop="_to3D('../3DOBJ_mobile/obj.html')"><img src="./obj.png" alt="">治疗规划</li>
    </ul>
    <transition name="bounce">
      <div class="layerBox" v-if="layerStatus">
        <i class="rayplus-icons delete" @click.stop="layerStatus=false">delete</i>
        <p>当前用户无三维功能使用权限</p>
        <p>请关注“睿佳医影”公众号申请试用</p>
        <div class="code"><img src="./code.png" /></div>
        <p class="text">扫描二维码关注“睿佳医影”公众号</p>
      </div>
     </transition>
  </section>
</template>

<script>
import Scroll from "@/base/scroll";
import { getRead } from "@/api";
import { cloneObj } from "@/util/tool.js";
export default {
  props: {
    studyActive: {
      type: [Number, String],
      default: null
    },
    curSeries: {
      type: [Object, Array],
      default: null
    },
    imgIY: {
      type: [Object, Array],
      default: null
    },
    userInfo: {}
  },
  data() {
    return {
      layerStatus: false,
      series: null
    };
  },
  watch: {
    curSeries() {
      this._initData();
    }
  },
  mounted() {
    this._initData();
  },
  methods: {
    _initData() {
      this.series = this.curSeries;
      // this.series = cloneObj(this.curSeries);
    },
    showHandle(flag = true) {
      this.show = flag;
      this.series = null;
      this.layerStatus = false;
      this.$emit("imageShow", flag);
    },
    _to3D(url) {
      if (this.userInfo.userStatus != 0) {
        this.layerStatus = true;
        this.$message({
          message: "您没有操作权限",
          type: "warning"
        });
      } else {
        let urlData = window.btoa(
          "SID=" + this.series.id + "&studyId=" + this.studyActive
        );
        window.location.href = url + "?" + urlData;
      }
    },
    _getRead(id) {
      getRead({ number: 1, "seriesId[0]": id }).then(res => {
        if (res.code == 1) {
          let urlData = window.btoa(
            "SID=" + this.series.id + "&studyId=" + this.studyActive
          );
          window.location.href = "../viewer_mobile/index.html?" + urlData;
        } else if (res.code == 27) {
          window.location.href = "https://www.rayplus.net/login/index.html";
        }
      });
    }
  },
  components: {
    Scroll
  }
};
</script>

<style lang="scss">
.imglist {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 13;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  &__content {
    position: absolute;
    overflow-y: scroll;
    height: 100%;
    width: 100%;
    padding-bottom: 60px;
  }
  &__item {
    text-align: center;
    padding: 10px 0;
    img {
      max-width: 80%;
    }
  }
}

.layerBox .delete {
  font-size: 14px;
  color: #b6b6b6;
  position: absolute;
  top: 10px;
  left: 10px;
}
.layerBox {
  width: 100%;
  height: 254px;
  left: 0;
  position: fixed;
  bottom: 80px;
  background: #dcdddf;
  padding-top: 36px;
}
.layerBox .code {
  width: 115px;
  height: 115px;
  margin: 12px auto;
}
.layerBox .code img {
  width: 100%;
  height: 100%;
}
.layerBox p {
  line-height: 21px;
  text-align: center;
  color: #148ecd;
  font-size: 12px;
}
.layerBox .text {
  color: #191919;
}

.bounce-enter-active,
.bounce-leave-active {
  transition: all 1s;
}
.bounce-enter,
.bounce-leave-to {
  opacity: 0;
}

.fnBtns {
  z-index: 100;
  width: 100%;
  height: 80px;
  background: rgba(21, 61, 109, 0.9);
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fnBtns li {
  flex: 1;
  color: #4ebafe;
  font-size: 11px;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  img {
    height: 42px;
  }
}
</style>
