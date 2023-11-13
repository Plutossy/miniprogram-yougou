<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {

      };
    },
    computed: {
      ...mapGetters('m_cart', ['total', 'checkedCount', 'checkedGoodsAmount']),
      // 是否全选
      isFullCheck() {
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      // label 的点击事件处理函数
      changeAllState() {
        // 修改购物车中所有商品的选中状态
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 14px;
    background-color: white;
    z-index: 999;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        font-weight: bold;
        color: #C00000;
      }
    }

    .btn-settle {
      min-width: 100px;
      height: 50px;
      color: white;
      line-height: 50px;
      text-align: center;
      background-color: #C00000;
      padding: 0 10px;
    }
  }
</style>