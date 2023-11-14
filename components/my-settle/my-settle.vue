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
    <view class="btn-settle" @click="settlement">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器id
        timer: null
      };
    },
    computed: {
      ...mapGetters('m_cart', ['total', 'checkedCount', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      // token 是用户登录成功之后的 token 字符串
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      // 是否全选
      isFullCheck() {
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState', 'clearCartByState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      // label 的点击事件处理函数
      changeAllState() {
        // 修改购物车中所有商品的选中状态
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 结算按钮处理函数
      settlement() {
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
        if (!this.addstr) return uni.$showMsg('请选择要收货地址！')
        // if (!this.token) return uni.$showMsg('请先登录！')
        if (!this.token) return this.delayNavigate()

        // 实现微信支付功能
        this.payOrder()
      },
      // 展示倒计时的提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请先登录再结算，\n' + n + '秒后自动跳转到登录界面.',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          duration: 1500
        })
      },
      // 延迟导航到 my 页面
      delayNavigate() {
        // 把 data 中的秒数重置成 3 秒
        this.seconds = 3
        // 1. 展示提示消息，此时 seconds 的值等于 3
        this.showTips(this.seconds)

        // 2. 创建定时器，每隔 1 秒执行一次
        this.timer = setInterval(() => {
          // 2.1 先让秒数自减 1
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            return uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  // 跳转的方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/cart/cart'
                })
              }
            })
          }
          // 2.2 再根据最新的秒数，进行消息提示
          this.showTips(this.seconds)
        }, 1000)
      },
      async payOrder() {
        // 创建订单对象
        const orderInfo = {
          order_price: this.checkedGoodsAmount,
          consignee_addr: this.addstr,
          goods: this.cart.filter(m => m.goods_state).map(n => ({
            goods_id: n.goods_id,
            goods_number: n.goods_count,
            goods_price: n.goods_price
          }))
        }
        // 发起请求
        const {
          data: res1
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)

        /* 
         *注意：
          因为token无效，所以这个地方必定失败，以下代码仅供参考 
        **/
        console.log(res1.meta.msg);
        if (res1.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 得到服务器响应的 订单编号
        const orderNumber = res1.message.order_number

        // 订单预支付
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        // 预付订单生成失败
        if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
        // 得到订单支付相关的必要参数
        const payInfo = res2.message.pay

        // 发起微信支付
        uni.requestPayment({
          ...payInfo,
          async success(succ) {
            // 完成了支付，进一步查询支付的结果
            const {
              data: res
            } = await uni.$http('/api/public/v1/my/orders/chkOrder', {
              order_number: orderNumber
            })
            // 检测到订单未支付
            if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
            // 检测到订单支付完成
            uni.showToast({
              title: '支付完成！',
              icon: 'success'
            })
            // 清空已经支付的物品
            this.clearCartByState()
          },
          fail: err => {
            return uni.$showMsg('订单未支付！')
          }
        })
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