<template>
  <section class="imglist">
    <ul v-if="series" class="imglist__content" @click.stop.prevent="showHandle(false)">
      <li class="imglist__item" v-for="i in Math.min(20, series.imageNum)" :key="i">
        <img @click.stop="_getRead(series.id)" :src="series.imgBase.substr(0,series.imgBase.length-7)+'IY'+i+'.png'+imgIY[i]" alt="">
      </li>
    </ul>
    <ul class="fnBtns">
      <li class="viewer" @click.stop="_getRead(series.id)"><img src="./images/viewer.png" alt="">影像诊断</li>
      <li class="vr" @click.stop="_to3D('../3DVR_mobile/index.html')"><img src="./images/vr.png" alt="">容积重建</li>
      <li class="obj" @click.stop="_to3D('../3DOBJ_mobile/obj.html')"><img src="./images/obj.png" alt="">治疗规划</li>
    </ul>
    <transition name="bounce">
      <div class="layerBox" v-if="layerStatus">
        <div class="layerBox__layer" @click.stop.prevent="layerStatus=false"></div>
        <!-- <i class="rayplus-icons" @click.stop="layerStatus=false">delete</i> -->
        <p>当前用户无三维功能使用权限</p>
        <p>请关注“睿佳医影”公众号申请试用</p>
        <div class="code"><img src="./images/code.png" /></div>
        <p class="text">扫描二维码关注“睿佳医影”公众号</p>
      </div>
     </transition>
  </section>
</template>

<script>
import Scroll from "@/base/scroll";
import { getRead } from "@/api";
import { cloneObj } from "@/util/tool.js";
import store from "store";
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
    },
    showHandle(flag = true) {
      this.show = flag;
      this.series = null;
      this.layerStatus = false;
      this.$emit("imageShow", flag);
    },
    _to3D(url) {
      if (this.userInfo.userStatus == 0) {  
        this.layerStatus = !this.layerStatus;
      } else {
        // 存储seriesActiveId 用于页面跳转回来的时候的显示
        store.set("activeGroup", {
          SID: this.series.id,
          STUDYID: this.studyActive,
          ACTIVE: false
        });
        let urlData = window.btoa(
          "SID=" + this.series.id + "&studyId=" + this.studyActive
        );
        this.showHandle(false);
        window.location.href = url + "?" + urlData;
      }
    },
    _getRead(id) {
      getRead({ number: 1, "seriesId[0]": id }).then(res => {
        if (res.code == 1) {
          // 存储seriesActiveId 用于页面跳转回来的时候的显示
          store.set("activeGroup", {
            SID: this.series.id,
            STUDYID: this.studyActive,
            ACTIVE: false
          });
          let urlData = window.btoa(
            "SID=" + this.series.id + "&studyId=" + this.studyActive
          );
          this.showHandle(false);
          window.location.href = "../viewer_mobile/index.html?" + urlData;
        } else if (res.code == 27) {
          this.showHandle(false);
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
@import "./css/index.scss";
</style>
