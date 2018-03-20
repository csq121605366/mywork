<template>
  <div v-cloak class="series">
    <div class="series__header">
      <div class="series__header__btn series__header__btn--show" @click.self.prevent="showHide=true" :class="showHide?'active':''">显示 "隐藏数据"</div>
      <div class="series__header__btn series__header__btn--hide" @click.self.prevent="showHide=false" :class="!showHide?'active':''">不显示 "隐藏数据"</div>
    </div>
    <div v-if="series" class="series__content">
      <!-- <scroll ref="seriesScroll" :list="series" class="series__scroll"> -->
        <ul v-if="series" class="series__list">
          <li 
          :class="{'active':seriesActiveId==item.id?true:false,'visible':item.visible==1?true:false}" 
          v-if="item.visible == 1||showHide?true:false" 
          v-for="(item,index) in series" :key="index" class="series__list__item">
            <!-- 显示的数据 -->
            <div v-if="item.visible" class="series__list__order">
              <img @click.self.prevent="seriesShowHide(item,false)"  class="series__list__eye" src="./images/eye--light.png" />
              <span>序列号：{{item.id}}</span>
            </div>
            <!-- 隐藏的数据 -->
            <div  v-else class="series__list__order">
              <img @click.self.prevent="seriesShowHide(item,true)" class="series__list__eye" src="./images/eye--gray.png" />
              <span>序列号：{{item.id}}</span>
            </div>
            <ul @click="getCurseries(item,item.id)" class="series__list__info">
              <li>
                <span>Series：{{item.description}}</span>
              </li>
              <li>
                <span>分辨率：{{item.resolution}}</span>
              </li>
              <li>
                <span>层厚：{{item.thickness}}</span>
              </li>
              <li>
                <span class="txt-left">#im：{{item.imageNum}}</span>
                <span class="txt-center">{{item.parts}}/{{item.mode}}</span>
                <span class="txt-right">日期：{{item.date}}</span>
              </li>
            </ul>
            <div class="series__list__remark">
              <span 
                class="series__list__remark-label" 
                :class="item.visible?'visible':''"
              >备注：</span>
              <div class="series__list__remark-txt">
                <input class="series__list__remark-input" type="text" v-model="item.remarks" disabled placeholder="点击右侧编辑图标，添加备注信息" 
                @blur.stop.prevent="changeSeriesRemarks(item,index,$event)">
              </div>
              <img v-if="focusId!=index" @click.stop.prevent="remarkOnFocus(item,index,$event)" class="series__list__remark-btn" src="./images/remark.png" />
              <img v-else class="series__list__remark-btn" src="./images/qd.png" alt="">
            </div>
          </li>
        </ul>
      <!-- </scroll> -->
    </div>
  </div>
</template>

<script>
import Scroll from "@/base/scroll";
import { changeremarks, seriesHide, seriesShow, checkStatus } from "@/api";
import { getObjXy } from "@/util/tool.js";
import store from "store";

export default {
  props: {
    oSeries: {
      type: [Object, Array],
      default: null
    }
  },
  data() {
    let sc = store.get("activeGroup");
    return {
      showHide: false,
      series: "",
      seriesActiveId: sc && sc.ACTIVE ? sc.SID : -1,
      focusId: -1,
      changeRemarkIng: false // 判断是否正在改变备注
    };
  },
  mounted() {
    this._initSeries();
  },
  methods: {
    _initSeries() {
      this.series = this.oSeries;
    },
    getCurseries(series, seriesId) {
      // 点击series
      this.seriesActiveId = -1;
      if (!this.changeRemarkIng) {
        this.seriesActiveId = seriesId;
        if (series && series.processingStatus > 4) {
          this.$emit("getCurseries", series, seriesId);
        } else {
          this._checkStatus(series, seriesId);
        }
      }
    },
    _checkStatus(series, seriesId) {
      checkStatus({ seriesId: series.id }).then(res => {
        if (res.processingStatus > 4) {
          this.$emit("getCurseries", series, seriesId);
        } else {
          this.$message({
            message: "正在处理中..."
          });
        }
      });
    },
    remarkOnFocus(res, index, e) {
      if (!this.changeRemarkIng) {
        this.changeRemarkIng = true;
        this.focusId = index;
        let target = e.target.parentElement.children[1].children[0];
        target.disabled = false;
        target.focus();
      }
    },
    changeSeriesRemarks(res, index, e, flag) {
      let target;
      target = e.target;
      // 将输入框变为不可用
      target.disabled = true;
      target.blur();
      if (target.value != "") {
        let data = {
          seriesid: res.id,
          remarks: target.value
        };
        changeremarks(data).then(response => {
          if (response.r) {
            this.$message({
              message: "备注修改失败！"
            });
          }
          this.changeRemarkIng = false;
          this.focusId = -1;
        });
      } else {
        setTimeout(() => {
          target.value = res.remarks;
          this.changeRemarkIng = false;
          this.focusId = -1;
        }, 30);
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
@import "./css/index.scss";
</style>
