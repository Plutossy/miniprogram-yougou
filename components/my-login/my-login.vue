<template>
  <view class="login-container">
    <!-- 提示登录图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">
      登录后尽享更多权益
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    name: "my-login",
    data() {
      return {};
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      getUserInfo() {
        uni.getUserInfo({
          provider: 'weixin',
          success: (res) => {
            if (res.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了授权！')
            // console.log(this); 用箭头函数解决 this 指向问题
            this.updateUserInfo(res.userInfo)

            // 获取登录成功后的 Token 字符串
            this.getToken(res)
          },
          fail(err) {
            console.log('获取用户信息错误！');
            return uni.$showMsg('获取用户信息错误！')
          }
        })
      },
      // 调用登录接口，换取永久的 token
      async getToken(info) {
        const res = await uni.login({
          provider: 'weixin' //使用微信登录
        }).catch(err => err)
        // 判断是否 uni.login() 调用失败
        if (res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }

        // 换取 token
        // const {
        //   data: loginResult
        // } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // if (loginResult.meta.status !== 200) {}return uni.$showMsg('登录失败！')
        // this.updateToken(loginResult.message.token)

        /* 
          *注意：
           因为没有接口权限，所以必定失败，可以自己拼接一个token
        **/
        // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo
        const tokenStr = query.iv + query.encryptedData + query.code

        // 编码
        const token = 'Bearer ' + encodeURIComponent(tokenStr)
        // 解码
        // const token1 = decodeURIComponent(tokenStr)

        // 判断 vuex 中的 redirectInfo 是否为 null
        // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
        this.navigateBack()

        this.updateToken(token)

        uni.$showMsg('登陆成功！')
      },
      // 返回登录之前的页面
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #eeeeee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 40px;
      background-color: #f5f5f5;
      border-radius: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      transform: translateY(50%);

    }

    .btn-login {
      width: 90%;
      background-color: #C00000;
      border-radius: 100px;
      margin: 15px 0;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>