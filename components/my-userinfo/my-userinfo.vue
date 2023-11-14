<template>
  <view class="my-userinfo-container">
    <!-- 头像昵称区域 -->
    <view class="top-box">
      <form @submit="setNickname">
        <view class="avatar">
          <image :src="userInfo.avatarUrl" class="avatar-img"></image>
          <button class="btn-avatar" open-type="chooseAvatar" @chooseavatar="getChooseAvatar">设置头像</button>
        </view>
        <view class="nickname">
          <input name="nickname" type="nickname" class="nickname-input" placeholder="请输入昵称"
            :value="userInfo.nickName" />
          <button class="btn-submit" form-type="submit">保存</button>
        </view>
      </form>
    </view>

    <!-- 面板区域 -->
    <view class="panel-list">
      <!-- 第一个面板 -->
      <view class="panel">
        <view class="panel-body">
          <!-- panel 的 item 项 -->
          <view class="panel-item">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panel-item">
            <text>14</text>
            <text>收藏的商品</text>
          </view>
          <view class="panel-item">
            <text>18</text>
            <text>关注的商品</text>
          </view>
          <view class="panel-item">
            <text>84</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      <!-- 第二个面板 -->
      <view class="panel">
        <!-- 面板的标题 -->
        <view class="panel-title">我的订单</view>
        <!-- 面板的主体 -->
        <view class="panel-body">
          <!-- 面板主体中的 item 项 -->
          <view class="panel-item">
            <image src="/static/my-icons/icon1.png" class="icon"></image>
            <text>待付款</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon2.png" class="icon"></image>
            <text>待收货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon3.png" class="icon"></image>
            <text>退款/退货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon4.png" class="icon"></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>
      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panel-list-item">
          <text>收货地址</text>
          <uni-icons type="arrowright"></uni-icons>
        </view>
        <view class="panel-list-item">
          <text>联系客服</text>
          <uni-icons type="arrowright"></uni-icons>
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    name: "my-userinfo",
    computed: {
      ...mapState('m_user', ['userInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateAvater', 'updateNickName', 'updateAddress', 'updateUserInfo', 'updateToken']),
      // 更新用户头像
      getChooseAvatar(e) {
        this.updateAvater(e.detail.avatarUrl)
      },
      // 更新用户昵称
      setNickname(e) {
        this.updateNickName(e.detail.value.nickname)
      },
      // 退出登录
      async logout() {
        const res = await uni.showModal({
          title: '提示',
          content: '确认退出登录吗？'
        }).catch(err => err)
        if (res.errMsg === 'showModal:ok' && res.confirm) {
          // 用户确认了退出登录的操作
          // 需要清空 vuex 中的 userinfo、token 和 address
          this.updateUserInfo({})
          this.updateToken('')
          this.updateAddress({})
        }
      }
    }
  }
</script>

<style lang="scss">
  .my-userinfo-container {
    height: 100%;
    // 为整个组件的结构添加浅灰色的背景
    background-color: #ececec;
    padding-bottom: 68px;

    .top-box {
      height: 400rpx;
      background-color: #c00000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .avatar {
        width: 200px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .avatar-img {
          display: block;
          width: 80px;
          height: 80px;
          border-radius: 40px;
          border: 2px solid white;
          box-shadow: 0 1px 5px black;
        }

        .btn-avatar {
          margin: 0;
          padding: 0;
          width: 70px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 14px;
          background-color: #f4f4f4;
        }
      }

      .nickname {
        width: 200px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .nickname-input {
          width: 70px;
          height: 40px;
          padding: 0 8px;
          font-size: 14px;
          background-color: #f4f4f4;
          border-radius: 8px;
        }

        .btn-submit {
          margin: 0;
          padding: 0;
          width: 70px;
          height: 30px;
          font-size: 14px;
          text-align: center;
          line-height: 30px;
          background-color: #f4f4f4;
        }
      }
    }

    .panel-list {
      padding: 0 10px;
      position: relative;
      top: -10px;

      .panel {
        background-color: white;
        border-radius: 3px;
        margin-bottom: 8px;

        .panel-title {
          line-height: 45px;
          padding-left: 10px;
          font-size: 15px;
          border-bottom: 1px solid #eeeeee;
        }

        .panel-body {
          display: flex;
          justify-content: space-around;

          .panel-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            padding: 10px 0;

            .icon {
              width: 35px;
              height: 35px;
            }
          }
        }

        .panel-list-item {
          height: 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          padding: 0 10px;
          border-bottom: 1px solid #efefef;
        }
      }
    }
  }
</style>