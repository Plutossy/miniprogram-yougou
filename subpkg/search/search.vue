<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar v-model="kw" @input="input" :radius="100" cancelButton="none" :focus="true"></uni-search-bar>
    </view>

    <!-- 搜索建立列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clear"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag v-for="(item,i) in histories" :key="i" :text="item" :circle="true"
          @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>

</template>

<script>
  export default {
    data() {
      return {
        // 延时器 timerId
        timer: null,
        // 输入关键词
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索关键词的历史记录
        historyList: []
      };
    },
    computed: {
      histories() {
        // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
        // 而是应该新建一个内存无关的数组，再进行 reverse 反转
        // 也可以用 unshift 为数组前边添加元素来解决
        return [...this.historyList].reverse()
      }
    },
    onLoad() {
      // 加载本地搜索历史记录
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      // 用户输入事件处理函数
      input() {
        // 清楚延时器
        clearTimeout(this.timer)
        // 定义延时器
        this.timer = setTimeout(() => {
          // 调用搜索结果方法
          this.getSearchResults()
        }, 500)
      },

      // 搜索结果方法
      async getSearchResults() {
        if (this.kw.length === 0 || this.kw.trim() == '') {
          this.kw = ''
          this.searchResults = []
          return uni.$showMsg('搜索内容不能为空！')
        }
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message

        // 查询到搜索建议后，调用 saveSearchHistory() 方法保存搜索关键词历史
        this.saveSearchHistory()
      },

      // 保存搜索关键词方法
      saveSearchHistory() {
        // this.historyList.push(this.kw)
        // set 函数有唯一性
        // 1. 将 Array 数组转化为 Set 对象
        const set = new Set(this.historyList)
        // 2. 调用 Set 对象的 delete 方法，移除对应的元素
        set.delete(this.kw)
        // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
        set.add(this.kw)
        // 4. 将 Set 对象转化为 Array 数组
        this.historyList = Array.from(set)

        // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },

      // 清空搜索历史事件处理函数
      clear() {
        this.historyList = [],
          uni.setStorageSync('kw', '[]')
      },

      // 跳转到商品详情页的处理函数
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },

      // 点击搜索历史跳转到商品列表的处理函数
      gotoGoodsList(item) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + item
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    // 吸顶
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .uni-searchbar {
    background-color: #C00000 !important;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #efefef;

      .goods-name {
        // 超出文本不换行
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
      }
    }
  }

  .history-box {
    padding: 0 10px;

    .history-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      height: 40px;
      border-bottom: 1px solid #efefef;

    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>