export default {
  // 为当前模块开启命名空间
  namespaced: true,
  // 模块的 state 数据
  state: {
    address: JSON.parse(uni.getStorageSync('address') || '{}')
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