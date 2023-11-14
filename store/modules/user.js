export default {
  // 为当前模块开启命名空间
  namespaced: true,
  // 模块的 state 数据
  state: {
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    // 登录成功之后的 token 字符串
    token: uni.getStorageSync('token') || '',
    // 用户的基本信息
    userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
    // 重定向的 object 对象 { openType, from }
    redirectInfo: null
  },
  // 模块的 mutations 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      // 调用存储到本地
      this.commit('m_user/saveAddressToStorage')
    },
    // 定义将 address 持久化存储到本地 mutations 方法
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 定义更新用户信息的方法
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
      // 储存到本地
      this.commit('m_user/saveUserInfoToStroage')
    },
    // 定义将 userInfo 存储到本地的 mutations 方法
    saveUserInfoToStroage(state) {
      uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
    },
    // 定义更新用户头像的方法
    updateAvater(state, avatarUrl) {
      state.userInfo.avatarUrl = avatarUrl
      // 储存到本地
      this.commit('m_user/saveUserInfoToStroage')
    },
    // 定义更新用户昵称的方法
    updateNickName(state, nickName) {
      state.userInfo.nickName = nickName
      // 储存到本地
      this.commit('m_user/saveUserInfoToStroage')
    },
    // 更新 token 字符串
    updateToken(state, token) {
      state.token = token
      // 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 token 字符串持久化存储到本地
      this.commit('m_user/saveTokenToStorage')
    },

    // 将 token 字符串持久化存储到本地
    saveTokenToStorage(state) {
      uni.setStorageSync('token', state.token)
    },
    // 更新重定向的信息对象
    updateRedirectInfo(state, info) {
      state.redirectInfo = info
    }
  },
  getters: {
    // 收货详细地址的计算属性
    addstr(state) {
      if (!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}