<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>
    <!-- 渲染收货信息的盒子 -->
    <view class="address-info-box" @click="chooseAddress" v-else>
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：<text>{{address.userName}}</text></view>
        </view>
        <view class="row1-right">
          <view class="phone">
            电话：<text>{{address.telNumber}}</text>
            <uni-icons type="arrowright" size="16"></uni-icons>
          </view>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addstr}}</view>
      </view>
    </view>
    <!-- 底部的边框线 -->
    <image src="@/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'
  export default {
    name: "my-address",
    data() {
      return {
        // 收货地址
        // address: {}
      };
    },
    computed: {
      ...mapState('m_user', ['address']),
      ...mapGetters('m_user', ['addstr'])
      // // 收货详细地址的计算属性
      // addstr() {
      //   if (!this.address.provinceName) return ''
      //   // 拼接 省，市，区，详细地址 的字符串并返回给用户
      //   return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
      // }
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress']),
      async chooseAddress() {
        // 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
        // 返回值是一个对象：errMsg为错误对象；之后为成功之后的收货地址对象
        const res = await uni.chooseAddress().catch(err => err)
        // console.log(res.errMsg);
        // 用户成功的选择了收货地址
        if (res.errMsg === 'chooseAddress:ok') {
          // 调用 Store 中提供的 updateAddress 方法，将 address 保存到 Store 里面
          this.updateAddress(res)
        }
        if (res.errMsg === 'chooseAddress:fail auth deny' || res.errMsg ===
          'chooseAddress:fail authorize no response') {
          // 失败重新授权
          this.reAuth()
        }
      },
      // 重新授权
      async reAuth() {
        // 提示用户对地址进行授权
        const res = await uni.showModal({
          content: '检测到您没有打开地址权限，是否去设置打开？',
          confirmText: '确认',
          cancelText: '取消'
        }).catch(err => err)
        if (res.cancel) return uni.$showMsg('你取消了地址授权！')
        // 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
        if (res.confirm) return uni.openSetting({
          // 授权结束，需要对授权的结果做进一步判断
          success(res) {
            // 地址授权的值等于 true，提示用户 “授权成功”
            if (res.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
            // 地址授权的值等于 false，提示用户 “您取消了地址授权”
            if (!res.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .address-choose-box {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .address-info-box {
    height: 90px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;

    .row1 {
      display: flex;
      justify-content: space-between;
      align-items: center;

      // .row1-left {
      //   .username {}
      // }

      .row1-right {
        display: flex;
        justify-content: space-between;

        .phone {
          margin-right: 5px;
        }
      }
    }

    .row2 {
      margin-top: 10px;
      display: flex;
      align-items: center;

      .row2-left {
        white-space: nowrap;
      }

      .row2-right {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .address-border {
    display: block;
    height: 5px;
    width: 100%;
  }
</style>