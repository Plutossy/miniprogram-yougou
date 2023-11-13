// VUE2: 导入 Vue 和 Vuex
// import Vue from 'vue'
// import Vuex from 'vuex'

import {
  createStore
} from "vuex";


// 导入购物车 vuex 模块
import moduleCart from './modules/cart.js'
// 导入用户的 vuex 模块
import moduleUser from './modules/user.js'

// VUE2: 将 Vuex 安装为 Vue 的插件
// Vue.use(Vuex) new Vue.Store

// 创建 Store 的实例对象
const store = createStore({
  // 挂载 store 模块
  modules: {
    // 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：
    // 购物车模块中 cart 数组的访问路径是 m_cart/cart
    m_cart: moduleCart,
    // 挂载用户的 vuex 模块，访问路径为 m_user
    m_user: moduleUser
  }
})

// 向外共享 Store 的实例对象
export default store