<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收货地址组件 -->
    <my-address></my-address>
    <!-- 购物车列表标题区域 -->
    <view class="cart-title">
      <!-- 左侧图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 描述文字 -->
      <text class="cart-title-text">购物车</text>
    </view>
    <!-- 购物车商品列表 -->
    <uni-swipe-action>
      <block v-for="(item, index) in cart" :key="index">
        <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(item)">
          <my-goods :goods="item" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler"
            @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 结算组件 -->
    <my-settle></my-settle>
  </view>
  <!-- 空白购物车的区域 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  // 按需导入 mapState 这个辅助函数
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    mixins: [badgeMix],
    data() {
      return {
        options: [{
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#C00000' // 按钮的背景颜色
          }
        }]
      };
    },
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      // 商品的勾选状态发生了变化
      radioChangeHandler(e) {
        this.updateGoodsState(e)
      },

      // 商品数量发生改变
      numberChangeHandler(e) {
        this.updateGoodsCount(e)
      },

      // 点击了滑动操作按钮
      swipeActionClickHandler(e) {
        this.removeGoodsById(e.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;

    .cart-title {
      height: 40px;
      display: flex;
      align-items: center;
      padding-left: 5px;
      border-bottom: 1px solid #d9d9d9;

      .cart-title-text {
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>