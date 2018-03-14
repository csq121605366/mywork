<template>
  <section v-if="curSeries" @click.stop.prevent="curSeries = null" class="imglist">
    <ul class="imglist__content">
      <li class="imglist__item" v-for="i in Math.min(20, curSeries.imageNum)" :key="i">
        <img :src="curSeries.imgBase.substr(0,curSeries.imgBase.length-7)+'IY'+i+'.png'+imgIY[i]" alt="">
      </li>
    </ul>
    <ul class="fnBtns">
      <li class="viewer" @click.stop="_getRead(curSeries.id)">影像诊断</li>
      <li class="vr" @click.stop="_to3D('../3DVR_mobile/index.html')">容积重建</li>
      <li class="obj" @click.stop="_to3D('../3DOBJ_mobile/obj.html')">治疗规划</li>
    </ul>
    <div class="layerBox" :class="layerStatus ?'bounceIn':(layerStatus == false?'bounceOut':'')">
      <i class="rayplus-icons delete" @click.stop="layerStatus = false">delete</i>
      <p>当前用户无三维功能使用权限</p>
      <p>请关注“睿佳医影”公众号申请试用</p>
      <div class="code"><img src="images/code.png" /></div>
      <p class="text">扫描二维码关注“睿佳医影”公众号</p>
    </div>
  </section>
</template>

<script>
import Scroll from "@/base/scroll";
import { getRead } from "@/api";

export default {
  props: {
    curSeries: {
      type: [Object, Array],
      default: null
    },
    imgIY: {
      type: [Object, Array],
      default: null
    }
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.curSeries, this.imgIY);
  },
  methods: {
    _to3D() {},
    _getRead(id) {
      var str = "number=1&seriesId[0]=" + id;
      getRead({ name: 1, "seriesId[0]": id }).then(res => {
        if (res.code == 1) {
          that.seriesActive = id;
          // var urlData = window.btoa(
          //   "SID=" + id + "&studyId=" + that.studyActive
          // );
          window.location.href = "../viewer_mobile/index.html?" + urlData;
        } else if (data.code == 27) {
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
  z-index: 11;
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
</style>
