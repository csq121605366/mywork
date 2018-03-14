<template>
	<header class="header">
    <div class="header__left center">
      <img @click="backHandle" class="header__icon" src="./back.png" alt="">
    </div>
    <div class="header__center center">
      <img class="header__icon" src="./logo.png" alt="">
    </div>
    <div class="header__right center">
      <img class="header__icon" src="./people.png" alt="">
    </div>
  </header>
</template>

<script>
export default {
  name: "co-header",
  props: {},
  data() {
    return {};
  },
  created() {
    // $.ajax({
    //   url: SERVERDOMAIN + "datalist/getUserStatus.php",
    //   success: data => {
    //     console.log(data);
    //   }
    // });
  },
  methods:{
    backHandle(){
      this.$emit('backHandle');
    }
  }
};
</script>

<style lang='scss'>
.header {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 88px;
  background: #315a8c;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  &__icon {
    max-height: 46px;
    width: auto;
    padding: 0 20px;
  }
  &__left {
  }
}
</style>