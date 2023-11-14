# miniprogram-yougou

A WeChat Mini Program Based On UniApp - MiniYougou Mini Program Project. Similar to the shopping cart case. (一个基于uniapp的微信小程序——Mini优购小程序项目，类似于购物车案例。)



### 开发工具

HbuilderX、微信开发者工具



### 使用技术

uniapp、vue3、vuex、sass等等



### 安装插件

``` json
"@escook/request-miniprogram": "^0.2.1"
```

> 请参考 **@escook/request-miniprogram** 的官方文档进行安装、配置、使用

> 官方文档：https://www.npmjs.com/package/@escook/request-miniprogram



### 项目运行

根目录下终端执行以下命令

```js
npm i
```



### 项目接口文档（参考）

[黑马优购--ShowDoc](https://www.showdoc.com.cn/128719739414963)



### 项目构建流程（参考）

因为本项目用的 vue3 所以可能有所不同，冲突地方以本项目为主：

[uniapp - 黑马优购 (itheima.net)](https://applet-base-api-t.itheima.net/docs-uni-shop/index.htm)



### 注意事项



* 在my-settle.vue中，因为token无效，所以支付功能必定失败，但是我还是写了成功后的代码仅供参考。

* 在my-login.vue中，因为没有接口权限，所以登录必定失败，但是本项目**自己拼接一个token**可用于测试。
