<template>
  <ul  v-cloak class="study">
    <div class="study__header">
      <div class="study__search">
        <img @click.stop.prevent="serachHandle" class="study__search__icon" src="./images/ss_06.png" />
        <input class="study__search__txt" ref="searchEl" @focus="searchClose=true" @blur="serachHandle"  v-model="searchInput" placeholder="姓名 / ID / 日期 / 描述 / 备注" type="text">
        <img @click="serachResetHandle" v-show="searchClose" class="study__search__icon p-8" src="./images/ss_03.png" />
      </div>
    </div>
    <ul class="study__sort">
      <li @click.stop.prevent="sort('id')">
           <span>病人ID</span>
          <img v-if="sortParam.sortBy=='id'&&sortParam.sortDir" style="transform: rotateZ(-180deg);"  src="./images/sort--light.png" alt="">
          <img v-else-if="sortParam.sortBy=='id'&&!sortParam.sortDir" src="./images/sort--light.png" alt="">
          <img v-else src="./images/sort--gray.png" alt="">
        </li>
      <li @click.stop.prevent="sort('name')">
          <span>病人姓名</span>
          <img v-if="sortParam.sortBy=='name'&&sortParam.sortDir"  style="transform: rotateZ(-180deg);"  src="./images/sort--light.png" alt="">
          <img v-else-if="sortParam.sortBy=='name'&&!sortParam.sortDir"  src="./images/sort--light.png" alt="">
          <img v-else src="./images/sort--gray.png" alt="">
       </li>
      <li @click.stop.prevent="sort('uploadTime')">
            <span>上传时间</span>
            <img v-if="sortParam.sortBy=='uploadTime'&&sortParam.sortDir"  style="transform: rotateZ(-180deg);"  src="./images/sort--light.png" alt="">
            <img v-else-if="sortParam.sortBy=='uploadTime'&&!sortParam.sortDir" src="./images/sort--light.png" alt="">
            <img v-else src="./images/sort--gray.png" alt="">
        </li>
    </ul>
    <section class="study__content">
      <!-- <scroll ref="studyScroll" :list="patients" class="study__scroll"> -->
        <ul v-if="patients" class="study__list">
          <li v-for="(item,x) in patients" :key="x" class="study__list__item">
            <div class="study__info__wrap study__base__info__wrap">
                  <div class="study__base__info study__info">
                  <div class="study__base__name">
                    <p>病人姓名&nbsp;:&nbsp;{{item.name}}</p>
                  </div>
                  <ul class="study__base__other">
                    <li>
                      <span class="f">病人ID&nbsp;:&nbsp;{{item.id}}</span>
                      <span>性别&nbsp;:&nbsp;{{item.gender|sexFilter}}</span>
                    </li>
                    <li>
                      <span class="f">年龄&nbsp;:&nbsp;{{item.studies[0].age}}</span>
                      <span>出生日期&nbsp;:&nbsp;{{item.birth}}</span>
                    </li>
                  </ul>
                </div>
            </div>
            <div v-if="item.studies.length" v-for="(ceil,y) in item.studies" :key="y"  class="study__info__wrap study__study__info__wrap"
            :class="activeId == ceil.id?'active':''"
            @click.stop="clickStudyHandle(ceil,ceil.id)"
            >
            <div class="study__study__info study__info">
              <ul>
                <li>
                  <span class="f">Study&nbsp;:&nbsp;{{ceil.description}}</span>
                </li>
                <li>
                  <span class="f">{{ceil.parts}}／{{ceil.mode}}</span>
                  <span>Study日期&nbsp;:&nbsp;{{ceil.date}}</span>
                </li>
              </ul>
                <div class="study__list__remark">
                <span class="study__list__remark-label">备注&nbsp;:&nbsp;</span>
                <div class="study__list__remark-txt">
                  <input class="study__list__remark-input" type="text" v-model="ceil.remarks" disabled placeholder="点击右侧编辑图标，添加备注信息"
                  @blur.stop.prevent="changeStudyRemarks(ceil,x,y,$event,true)"
                  >
                </div>
                <img v-if="focusId.x!=x||focusId.y!=y" @click.stop.prevent="remarkOnFocus(ceil,x,y,$event)" class="study__list__remark-btn" src="./images/remark.png" />
                <img v-else @click.stop.prevent="changeStudyRemarks(ceil,x,y,$event)" class="study__list__remark-btn" src="./images/qd.png" alt="">
              </div>
            </div>
            </div>
          </li>
        </ul>
      <!-- </scroll> -->
    </section>
  </ul>
</template>

<script>
import Scroll from "@/base/scroll";
import { changeremarks } from "@/api";
import { getObjXy, cloneObj } from "@/util/tool.js";
import sortBy from "lodash/sortBy";
export default {
  props: {
    oPatients: {
      type: [Object, Array],
      default: null
    }
  },
  data() {
    return {
      patients: null,
      activeId: -1,
      sortParam: { sortBy: "name", sortDir: true },
      // 判断是否正在改变备注
      changeRemarkIng: false,
      searchInput: "",
      searchClose: false,
      focusId: { x: -1, y: -1 }
    };
  },
  watch: {
    oPatients(res) {
      if (res !== this.patients) {
        this._initData();
      }
    },
    searchInput() {
      this.serachHandle();
    }
  },
  mounted() {
    this._initData();
    let self = this;
  },
  methods: {
    _initData() {
      this.patients = this.oPatients;
      // let test = cloneObj(this.oPatients[0].studies);
      // this.oPatients[0].studies.push(test);
    },
    remarkOnFocus(res, x, y, e) {
      this.focusId = { x, y };
      this.changeRemarkIng = true;
      let target = e.target.parentElement.children[1].children[0];
      // 注释的内容为输入框focus时的页面滚动应为有bug所以暂时不用
      let nHeader = getObjXy(document.querySelector(".header")).height;
      let nStudyHeader = getObjXy(document.querySelector(".study__header"))
        .height;
      let nStudySort = getObjXy(document.querySelector(".study__sort")).height;

      let scrolly =
        getObjXy(target).top - nHeader - nStudyHeader - nStudySort - 50;
      // this.$refs.studyScroll.scrollBy(0, -scrolly, 1);

      // target.scrollIntoView(true);
      // e.scrollIntoViewIfNeeded();
      target.disabled = false;
      target.focus();
    },
    changeStudyRemarks(res, x, y, e, flag) {
      // cansend 解决 input blur 和点击提交按钮的 两次运行这个方法的问题
      if (!this.canSend) {
        this.canSend = true;
        // flag 表示是自己blur或者是点击图标
        let target;
        if (flag) {
          target = e.target;
        } else {
          target = e.target.parentElement.children[1].children[0];
        }
        // 将输入框变为不可用
        target.disabled = true;
        target.blur();
        if (target.value != "") {
          let data = {
            studyid: res.id,
            remarks: target.value
          };
          changeremarks(data).then(response => {
            if (response.r) {
              alert("备注修改失败！");
            }
            this.changeRemarkIng = false;
            this.canSend = false;
            this.focusId = { x: -1, y: -1 };
          });
        } else {
          setTimeout(() => {
            this.changeRemarkIng = false;
            this.canSend = false;
            target.value = res.remarks;
            this.focusId = { x: -1, y: -1 };
          }, 300);
        }
      }
    },
    resetActiveId() {
      this.activeId = -1;
    },
    clickStudyHandle(study, activeid) {
      if (!this.changeRemarkIng) {
        // flag 表示数据是否需要进行更新
        this.activeId = activeid;
        this.$emit("seriesActive", study.series, study.id);
      }
    },
    serachResetHandle() {
      this.searchInput = "";
      this._initData();
    },
    serachHandle() {
      // 搜索内容
      let searchTxt = this.searchInput;
      if (searchTxt) {
        this.patients = [];
        var r = RegExp(searchTxt, "i");
        for (var i = 0, alen = this.oPatients.length; i < alen; i++) {
          var p = this.oPatients[i],
            name = p.name.match(r),
            id = p.id.toString();
          id = id.match(r);
          for (var j = 0, blen = p.studies.length; j < blen; j++) {
            var s = p.studies[j],
              date = s.date.match(r),
              description = s.description.match(r),
              remarks = s.remarks.match(r);
            if (name || id || date || description || remarks) {
              this.patients.push(p);
              break;
            }
          }
        }
        this.searchClose = true;
      } else {
        // 如果为空 则初始化数据
        this._initData();
        this.searchClose = false;
      }
    },
    sort(type) {
      if (type == "name" && this.sortParam.sortBy == "name") {
        // 上次排序是name 这次就是变顺序
        this.sortParam.sortDir = !this.sortParam.sortDir;
        this._initData();
        this.serachHandle();
        if (this.sortParam.sortDir) {
          // 正序
          this.patients = this.patients.sort(function(a, b) {
            let re = a.name.localeCompare(b.name);
            return re;
          });
        } else {
          // 倒序
          this.patients = this.patients.sort(function(a, b) {
            let re = a.name.localeCompare(b.name);
            return -re;
          });
        }
      } else if (type == "name" && this.sortParam.sortBy != "name") {
        // 上次排序不是name 方向初始化 数据初始化
        this.sortParam.sortBy = "name";
        this.sortParam.sortDir = true;
        this._initData();
        this.serachHandle();
        // 正序
        this.patients = this.patients.sort(function(a, b) {
          let re = a.name.localeCompare(b.name);
          return re;
        });
      } else if (type == "id" && this.sortParam.sortBy == "id") {
        this.sortParam.sortDir = !this.sortParam.sortDir;
        if (this.sortParam.sortDir) {
          this.patients = sortBy(this.patients, el => {
            return el.id;
          });
        } else {
          this.patients = sortBy(this.patients, el => {
            return -el.id;
          });
        }
      } else if (type == "id" && this.sortParam.sortBy != "id") {
        this.sortParam.sortBy = "id";
        this.sortParam.sortDir = true;
        this.patients = sortBy(this.patients, el => {
          return el.id;
        });
      } else if (
        type == "uploadTime" &&
        this.sortParam.sortBy == "uploadTime"
      ) {
        this.sortParam.sortDir = !this.sortParam.sortDir;
        if (this.sortParam.sortDir) {
          this.patients = sortBy(this.patients, el => {
            /**
             * 这里排序有点问题
             * 目前是按照第一个studies来排序
             */
            let time = new Date(el.studies[0].uploadTime);
            return time;
          });
        } else {
          this.patients = sortBy(this.patients, el => {
            /**
             * 这里排序有点问题
             * 目前是按照第一个studies来排序
             */
            let time = new Date(el.studies[0].uploadTime);
            return -time;
          });
        }
      } else if (
        type == "uploadTime" &&
        this.sortParam.sortBy != "uploadTime"
      ) {
        this.sortParam.sortBy = "uploadTime";
        this.sortParam.sortDir = true;
        this.patients = sortBy(this.patients, el => {
          let time = new Date(el.studies[0].uploadTime);
          return time;
        });
      }
    }
  },
  components: {
    Scroll
  },
  filters: {
    sexFilter(res) {
      if (/F/g.test(res)) {
        return "女";
      } else if (/M/g.test(res)) {
        return "男";
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss">
@import "./css/index.scss";
</style>
