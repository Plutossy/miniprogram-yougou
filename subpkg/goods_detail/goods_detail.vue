<template>
  <!-- 解决商品价格闪烁的问题 -->
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in goods_info.pics" :key="index">
        <image :src="item.pics_big" @click="preview(index)"></image>
      </swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <!-- 商品信息主体 -->
      <view class="goods-info-body">
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="grey"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
    </view>

    <!-- 商品图文信息区域 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>

  </view>
</template>

<script>
  // 从 vuex 中按需导出 mapState,mapMutations,mapGetters 辅助方法
  // import { computed } from 'vue'
  // import { useStore } from 'vuex'
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'

  export default {
    data() {
      return {
        // 商品详情对象
        goods_info: {},
        options: [{
          icon: 'shop',
          text: '店铺',
          infoBackgroundColor: '#007aff',
          infoColor: "red"
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      }
    },
    computed: {
      // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
      // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
      ...mapState('m_cart', ['cart']),
      // 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
      ...mapGetters('m_cart', ['total'])
    },
    // 逐个注册费事
    // setup() {
    //   const store = useStore()
    //   return {
    //     // 在 computed 函数中访问 state
    //     cart: computed(() => store.state.m_cart.cart),
    //     // 在 computed 函数中访问 mutations
    //     addToCart: computed(() => store.commit('m_cart/addToCart')),
    //     在 computed 函数中访问 getter
    //     total: computed(() => store.getters.m_cart.total)
    //   }
    // },
    watch: {
      // 监听 total 值的变化，通过第一个形参得到变化后的新值
      total: {
        handler(newVal) {
          // 通过数组的 find() 方法，找到购物车按钮的配置对象
          const findResult = this.options.find(e => e.text === '购物车')
          // 动态为购物车按钮的 info 属性赋值
          if (findResult) findResult.info = newVal
        },
        immediate: true
      }
    },
    onLoad(options) {
      // 获取商品 Id
      const goods_id = options.goods_id
      // 调用获取详情数据的方法
      this.getGoodsDetail(goods_id)
    },
    methods: {
      // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      ...mapMutations('m_cart', ['addToCart']),

      // 定义请求商品详情数据的方法
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
        // 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display: block;"')
          .replace(/.webp/g, '.jpg')
        this.goods_info = res.message
      },
      // 实现轮播图的预览效果
      preview(current) {
        // 调用 uni.previewImage() 方法预览图片
        uni.previewImage({
          current,
          urls: this.goods_info.pics.map(e => e.pics_big)
        })
      },
      // 左侧按钮的点击事件处理函数
      onClick(e) {
        if (e.content.text === '购物车') {
          // 切换到购物车页面
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      // 右侧按钮的点击事件处理函数
      buttonClick(e) {
        if (e.content.text === '加入购物车') {
          // 组织一个商品的信息对象 
          // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
          const goods = {
            goods_id: this.goods_info.goods_id,
            goods_name: this.goods_info.goods_name,
            goods_price: this.goods_info.goods_price,
            goods_count: 1,
            goods_small_logo: this.goods_info.goods_small_logo,
            goods_state: true
          }
          // 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
          this.addToCart(goods)
        }
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      font-size: 18px;
      color: #C00000;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        padding-right: 10px;
      }

      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 2px solid #dddddd;
        color: gray;
      }
    }

    .yf {
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    }
  }

  .goods-detail-container {
    // 给页面外层的容器，添加 50px 的内padding，
    // 防止页面内容被底部的商品导航组件遮盖
    padding-bottom: 50px;
  }

  .goods_nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>