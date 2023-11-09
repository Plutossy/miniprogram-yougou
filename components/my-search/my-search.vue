<template>
  <view class="my-search-container" :style="{'background-color': bgcolor}" @click="searchBoxHandler">
    <view class="my-search-box" :style="{borderRadius: radius + 'px'}">
      <uni-icons type="search" size="30"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    props: {
      bgcolor: {
        type: String,
        default: '#C00000'
      },
      radius: {
        type: Number,
        default: 18
      }
    },
    data() {
      return {

      };
    },
    methods: {
      searchBoxHandler() {
        this.$emit('click')
      },
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 50px;
    // background-color: #C00000;
    padding: 0 10px;
    display: flex;
    align-items: center;

    .my-search-box {
      width: 100%;
      height: 36px;
      background-color: #FFFFFF;
      // border-radius: 18px;
      display: flex;
      justify-content: center;
      align-items: center;

      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>