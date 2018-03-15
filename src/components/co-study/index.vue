<template>
  <ul  v-cloak class="study">
    <div class="study__header">
      <div class="study__search">
        <span class="study__search__icon rayplus-icons">search</span>
        <input class="study__search__txt" v-model="searchInput" @change.stop.prevent="serachHandle" placeholder="姓名 / ID / 日期 / 描述 / 备注" type="text">
      </div>
    </div>
    <ul class="study__sort">
      <li @click.stop.prevent="sort('id')">
           <span>病人ID</span>
          <img v-if="sortParam.sortBy=='id'&&sortParam.sortDir" style="transform: rotateZ(-180deg);"  src="./sort--light.png" alt="">
          <img v-else-if="sortParam.sortBy=='id'&&!sortParam.sortDir" src="./sort--light.png" alt="">
          <img v-else src="./sort--gray.png" alt="">
        </li>
      <li @click.stop.prevent="sort('name')">
          <span>病人姓名</span>
          <img v-if="sortParam.sortBy=='name'&&sortParam.sortDir"  style="transform: rotateZ(-180deg);"  src="./sort--light.png" alt="">
          <img v-else-if="sortParam.sortBy=='name'&&!sortParam.sortDir"  src="./sort--light.png" alt="">
          <img v-else src="./sort--gray.png" alt="">
       </li>
      <li @click.stop.prevent="sort('uploadTime')">
            <span>上传时间</span>
            <img v-if="sortParam.sortBy=='uploadTime'&&sortParam.sortDir"  style="transform: rotateZ(-180deg);"  src="./sort--light.png" alt="">
            <img v-else-if="sortParam.sortBy=='uploadTime'&&!sortParam.sortDir" src="./sort--light.png" alt="">
            <img v-else src="./sort--gray.png" alt="">
        </li>
    </ul>
    <section class="study__content">
      <scroll class="study__scroll">
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
                  <input class="study__list__remark-input" type="text" v-model="ceil.remarks" :ref="'remarksInput-'+x+'-'+y" disabled placeholder="点击右侧编辑图标，添加备注信息"
                    @blur.self.prevent="changeStudyRemarks(ceil,x,y)"
                  >
                </div>
                <img v-if="focusId.x!=x||focusId.y!=y" @click.self="remarkOnFocus(ceil,x,y)" class="study__list__remark-btn" src="./remark.png" />
                <img v-else @click.self.prevent="changeStudyRemarks(ceil,x,y)" class="study__list__remark-btn" src="./qd.png" alt="">
              </div>
            </div>
            </div>
          </li>
        </ul>
      </scroll>
    </section>
  </ul>
</template>

<script>
import Scroll from "@/base/scroll";
import { changeremarks } from "@/api";
import { cloneObj } from "@/util/tool.js";
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
      focusId: { x: -1, y: -1 }
    };
  },
  watch: {
    oPatients(res) {
      if (res !== this.patients) {
        this._initData();
      }
    }
  },
  mounted() {
    this._initData();
    console.log(this.patients);
  },
  methods: {
    _initData() {
      this.patients = cloneObj(this.oPatients);
    },
    remarkOnFocus(res, x, y) {
      this.focusId = { x, y };
      this.changeRemarkIng = true;
      let e = this.$refs["remarksInput-" + x + "-" + y][0];
      e.disabled = false;
      e.focus();
    },
    changeStudyRemarks(res, x, y) {
      let e = this.$refs["remarksInput-" + x + "-" + y][0];
      // 将输入框变为不可用
      e.disabled = true;
      if (e.value != "" ) {
        let data = {
          studyid: res.id,
          remarks: e.value
        };
        changeremarks(data).then(response => {
          if (response.r) {
            alert("备注修改失败！");
          }
          this.$emit("studyNeedsUpdate");
          this.changeRemarkIng = false;
          this.focusId = { x: -1, y: -1 };
        });
      } else {
        this.changeRemarkIng = false;
        e.value = res.remarks;
        this.focusId = { x: -1, y: -1 };
      }
    },
    resetActiveId() {
      this.activeId = -1;
    },
    clickStudyHandle(study, activeid) {
      if (!this.changeRemarkIng) {
        // flag 表示数据是否需要进行更新
        let updateArr = [];
        this.activeId = activeid;
        study.series.forEach(el => {
          // 如果不等于5 表示还有series在processing中 所以需要定时更新数据
          if (el.processingStatus != 5) {
            updateArr.push(el);
          }
        });
        this.$emit("seriesActive", study.series, study.id, updateArr);
      }
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
      } else {
        this._initData();
      }
    },
    sort(type) {
      if (type == "name" && this.sortParam.sortBy == "name") {
        // 上次排序是name 这次就是变顺序
        this.sortParam.sortDir = !this.sortParam.sortDir;
        this._initData();
        this.serachHandle();
        if (!this.sortParam.sortDir) {
          let arr = [];
          this.patients = this.patients.reverse();
        }
      } else if (type == "name" && this.sortParam.sortBy != "name") {
        // 上次排序不是name 方向初始化 数据初始化
        this.sortParam.sortBy = "name";
        this.sortParam.sortDir = true;
        this._initData();
        this.serachHandle();
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
             *
             */
            let time = new Date(el.studies[0].uploadTime);
            return time;
          });
        } else {
          this.patients = sortBy(this.patients, el => {
            /**
             * 这里排序有点问题
             *
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
.study {
  position: absolute;
  left: 0;
  padding-top: 88px;
  top: 0;
  width: 100%;
  height: 100%;
  &__header {
    height: 88px;
    padding: 0 30px;
    border-bottom: 1px solid #dfdfdf;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
  }
  &__search {
    height: 60px;
    border-radius: 6px;
    display: flex;
    color: #999999;
    justify-content: center;
    align-items: center;
    flex-flow: row nowrap;
    background-color: #e3e6e6;
    &__icon {
      flex: 0 1 auto;
      height: 25px;
      font-size: 28px;
      width: 48px;
      padding: 0 10px;
      background-color: transparent;
    }
    &__txt {
      border: none;
      text-indent: 10px;
      flex: 1 1 auto;
      background-color: #e3e6e6;
    }
  }
  &__content {
    position: absolute;
    width: 100%;
    top: 254px;
    left: 0;
    bottom: 0;
  }

  &__scroll {
    width: 100%;
    height: 100%;
    background-color: #e2e5e5;
    overflow: hidden;
  }
  &__sort {
    height: 78px;
    line-height: 78px;
    font-size: 30px;
    color: #666;
    display: flex;
    flex-flow: row nowrap;
    text-align: center;
    justify-content: space-around;
    align-items: center;
    li.active {
      color: #e68f04;
    }
    span {
      vertical-align: middle;
      padding-right: 10px;
    }
    img {
      height: 22px;
      vertical-align: middle;
    }
  }

  &__info__wrap {
    padding: 0 22px;
  }
  &__info {
    padding: 10px 0;
    border-bottom: 1px solid #d6d8da;
  }
  .study__info__wrap:last-child .study__info {
    border: none;
  }
  &__base {
    &__info__wrap {
      border: 4px solid #f0f0f0;
      background-color: #f0f0f0;
    }
    &__name {
      line-height: 42px;
      padding-bottom: 14px;
      font-size: 30px;
      color: #e48f00;
      p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &__other {
      font-size: 28px;
      color: #999;
      li {
        line-height: 40px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .f {
          width: 378px;
          margin-right: 30px;
          flex: 0 0 auto;
        }
      }
    }
  }

  &__study {
    &__info {
      font-size: 30px;
      color: #666;
      line-height: 44px;
      &__wrap {
        border: 4px solid #fff;
        background-color: #fff;
        &.active {
          border: 4px solid #e39000;
        }
      }

      li {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .f {
          width: 378px;
          margin-right: 30px;
          flex: 0 0 auto;
        }
      }
    }
  }

  &__list {
    padding-bottom: 10px;
    &__item {
      margin-top: 10px;
      background-color: #fff;
      &.active {
        border-color: #ea7400;
      }
      &:last-child {
        margin-bottom: 20px;
      }
    }
    &__remark {
      position: relative;
      font-size: 30px;
      padding-top: 16px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      color: #666666;
      &-label {
        width: 100px;
      }
      &-txt {
        height: 74px;
        flex: 1 1 auto;
        position: relative;
      }
      &-input {
        position: absolute;
        text-indent: 10px;
        line-height: 56px;
        left: 0;
        top: 0;
        width: 100%;
        border: 2px solid #fff;
        background-color: transparent;
        height: 100%;
        color: #999;
        border-radius: 6px;
        &:focus {
          background-color: #e3e6e6;
          border: 2px solid #e6a118;
        }
      }
      &-btn {
        height: 34px;
        width: 68px;
        padding-left: 30px;
      }
    }
  }
}
</style>
