<template>
  <div v-cloak class="series">
    <div class="series__header">
      <div class="series__header__btn series__header__btn--show" @click.self.prevent="showHide=true" :class="showHide?'active':''">显示 "隐藏数据"</div>
      <div class="series__header__btn series__header__btn--hide" @click.self.prevent="showHide=false" :class="!showHide?'active':''">不显示 "隐藏数据"</div>
    </div>
    <div v-if="series" class="series__content">
      <scroll ref="scroll" class="series__scroll">
        <ul class="series__list">
          <li :class="seriesActiveId==item.id?'active':''" v-if="item.visible == 1||showHide?true:false" v-for="(item,index) in series" :key="index" class="series__list__item">
            <!-- 显示的数据 -->
            <div v-if="item.visible" class="series__list__order visible">
              <img @click.self.prevent="seriesShowHide(item,false)"  class="series__list__eye" src="./eye--light.png" />
              <span>序列号&nbsp;:&nbsp;{{item.id}}</span>
            </div>
            <!-- 隐藏的数据 -->
            <div  v-else class="series__list__order">
              <img @click.self.prevent="seriesShowHide(item,true)" class="series__list__eye" src="./eye--gray.png" />
              <span>序列号&nbsp;:&nbsp;{{item.id}}</span>
            </div>
            <ul @click="getCurseries(item,item.id)" class="series__list__info">
              <li>
                <span>Series&nbsp;:&nbsp;{{item.description}}</span>
              </li>
              <li>
                <span>分辨率&nbsp;:&nbsp;{{item.resolution}}</span>
              </li>
              <li>
                <span>层厚&nbsp;:&nbsp;{{item.thickness}}</span>
              </li>
              <li>
                <span class="txt-left">#im&nbsp;:&nbsp;{{item.imageNum}}</span>
                <span class="txt-center">{{item.parts}}/{{item.mode}}</span>
                <span class="txt-right">日期&nbsp;:&nbsp;{{item.date}}</span>
              </li>
            </ul>
            <div class="series__list__remark">
              <span class="series__list__remark-label" :class="item.visible?'visible':''">备注&nbsp;:&nbsp;</span>
              <div class="series__list__remark-txt">
                <input class="study__list__remark-input" type="text" v-model="item.remarks" ref="remarksInput" disabled :value="item.remarks.length?item.remarks:'点击右侧编辑图标，添加备注信息'" 
                @blur.stop.prevent="changeSeriesRemarks(item,index)">
              </div>
              <img v-if="focusId!=index" @click.stop.prevent="remarkOnFocus(item,index)" class="series__list__remark-btn" src="./remark.png" />
              <img v-else @click.stop.prevent="changeSeriesRemarks(item,index)" class="series__list__remark-btn" src="./qd.png" alt="">
            </div>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
import Scroll from "@/base/scroll";
import { changeremarks, seriesHide, seriesShow } from "@/api";
import { cloneObj } from "@/util/tool.js";
export default {
  props: {
    oSeries: {
      type: [Object, Array],
      default: null
    }
  },
  data() {
    return {
      showHide: false,
      series: "",
      seriesActiveId: -1,
      focusId: -1,
      changeRemarkIng: false // 判断是否正在改变备注
    };
  },
  watch: {
    oSeries() {
      this._initSeries();
    }
  },
  mounted() {
    this._initSeries();
  },
  methods: {
    _initSeries() {
      // this.series = cloneObj(this.oSeries);
      this.series = this.oSeries;
    },
    getCurseries(series, series_id) {
      // 点击series
      this.seriesActiveId = -1;
      if (!this.changeRemarkIng) {
        this.seriesActiveId = series_id;
        this.$emit("getCurseries", series, series_id);
      }
    },
    remarkOnFocus(res, index) {
      this.changeRemarkIng = true;
      this.focusId = index;
      let e = this.$refs.remarksInput[index];
      if (e.getBoundingClientRect) {
        let scrolltop = e.getBoundingClientRect().bottom - 240;
        this.$refs.scroll.scrollBy(0, -scrolltop, 1);
      }
      // e.scrollIntoView(true);
      // e.scrollIntoViewIfNeeded();
      e.disabled = false;
      e.focus();
    },
    changeSeriesRemarks(res, index) {
      // 改变seies值
      let e = this.$refs.remarksInput[index];
      e.disabled = true;
      if (e.value != "") {
        let data = {
          seriesid: res.id,
          remarks: e.value
        };
        changeremarks(data).then(response => {
          if (response.r) {
            alert("备注修改失败！");
          }
          this.changeRemarkIng = true;
          this.focusId = -1;
        });
      } else {
        // 设置定时器解决300秒问题
        setTimeout(() => {
          e.value = res.remarks;
          this.changeRemarkIng = true;
          this.focusId = -1;
        }, 300);
      }
    },
    seriesShowHideReq(req, flag) {
      // 显示隐藏 功能键
      // flag = true 表示显示 flage = false 表示隐藏
      if (flag) {
        return new Promise((resolve, reject) => {
          seriesShow({ id: req.id }).then(res => {
            if (res.code == 1) {
              resolve();
            } else {
              reject();
            }
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          seriesHide({ number: 1, "seriesId[0]": req.id }).then(res => {
            if (res.code == 1) {
              resolve();
            } else {
              reject();
            }
          });
        });
      }
    },
    seriesShowHide(req, flag) {
      this.seriesShowHideReq(req, flag)
        .then(() => {
          req.visible = flag ? 1 : 0;
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "操作失败!"
          });
        });
    }
  },
  components: {
    Scroll
  }
};
</script>

<style lang="scss">
.series {
  padding-top: 88px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: #e2e5e5;
  &__header {
    height: 88px;
    background-color: #fff;
    line-height: 64px;
    padding: 12px 15px;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    &__btn {
      flex: 1 1 auto;
      margin: 0 15px;
      border-radius: 6px;
      font-size: 30px;
      background: #fff;
      text-align: center;
      background-color: #f5f5f5;
      color: #666;
      &.active {
        background-color: #f8efe0;
        color: #ea7400;
      }
    }
  }
  &__content {
    position: absolute;
    width: 100%;
    top: 176px;
    left: 0;
    bottom: 0;
  }
  &__scroll {
    width: 100%;
    height: 100%;
    background-color: #e2e5e5;
    overflow: hidden;
  }

  &__list {
    padding-bottom: 10px;
    &__info {
      padding-top: 7px;
      color: #9a9a9a;
      font-size: 24px;
      line-height: 38px;
      display: flex;
      flex-flow: column nowrap;
      padding-bottom: 17px;
      border-bottom: 1px solid #dfdfdf;
      li {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        span {
          flex: 1 1 auto;
        }
      }
    }
    &__item {
      margin-top: 10px;
      background-color: #fff;
      border: 4px solid #fff;
      padding: 10px 26px;
      &.active {
        border-color: #ea7400;
      }
      &:last-child {
        margin-bottom: 10px;
      }
    }
    &__eye {
      display: inline-block;
      vertical-align: middle;
      width: 44px;
    }
    &__order {
      font-size: 30px;
      height: 66px;
      line-height: 66px;
      color: #999;
      &.visible {
        color: #ea7400;
      }
      span {
        margin-left: 30px;
      }
    }
    &__remark {
      position: relative;
      font-size: 30px;
      line-height: 1;
      padding-top: 16px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      color: #666666;
      &-label {
        width: 100px;
        color: #999;
        &.visible {
          color: #666;
        }
      }
      &-txt {
        height: 74px;
        flex: 1 1 auto;
        position: relative;
      }
      &-remind {
        color: #dfdfdf;
      }
      &-input {
        position: absolute;
        text-indent: 10px;
        line-height: 56px;
        border: 2px solid #fff;
        background-color: transparent;
        left: 0;
        top: 0;
        width: 100%;
        border: none;
        background-color: transparent;
        height: 100%;
        color: #999;
        &:focus {
          background-color: #e3e6e6;
          border: 2px solid #e6a118;
        }
      }
      &-btn {
        height: 44px;
        width: 68px;
        padding-left: 30px;
      }
    }
  }
}
</style>
