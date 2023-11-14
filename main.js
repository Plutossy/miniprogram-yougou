// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import App from './App.vue'
// 导入 store 的实例对象
import store from './store/store.js'
export function createApp() {
  const app = createSSRApp(App)
  // 将 store 挂载到 Vue 实例上
  app.use(store)
  return {
    app
  }
}
// #endif

// 导入网络请求包
import {
  $http
} from '@escook/request-miniprogram'

uni.$http = $http

// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })
  // console.log(options);
  // console.log(store);
  // 判断请求的是否为有权限的 API 接口
  if (options.url.indexOf('/my') !== -1) {
    options.header = {
      Authorization: store.state.m_user.token
    }
  }
}
// 响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}

// 封装弹框提示
uni.$showMsg = function(title = "数据加载失败！", duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}