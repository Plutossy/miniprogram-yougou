<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <label class="radio" v-if="showRadio" @click="radioClickHandler">
        <radio :checked="goods.goods_state" color="#C00000" />
      </label>
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 商品标题 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{tofixed(goods.goods_price)}}</view>
        <!-- 商品数量 -->
        <uni-number-box :min="1" v-model='goods.goods_count' v-if="showNum" background="#e6e6e6"
          @change="numChangeHandler"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    // 定义 props 属性，用来接收外界传递到当前组件的数据
    props: {
      // 商品的信息对象
      goods: {
        type: Object,
        default: {},
      },
      // 是否展示图片左侧的 radio
      showRadio: {
        type: Boolean,
        default: false
      },
      // 是否展示价格右侧的 NumberBox 组件
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    methods: {
      // 商品价格的过滤函数,vue3 没有过滤器
      // 把数字处理为带两位小数点的数字
      tofixed(num) {
        return Number(num).toFixed(2)
      },
      // 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
      // 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
      radioClickHandler() {
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      // NumberBox 组件的 change 事件处理函数
      numChangeHandler(val) {
        // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          // 商品的最新数量
          goods_count: +val // Number 类型
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    // 让 goods-item 项占满整个屏幕的宽度
    width: 100%;
    // 设置盒模型为 border-box
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #efefef;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-price {
          font-size: 16px;
          color: #C00000;
        }
      }
    }
  }
</style>