<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends"/>
    <feature-view/>
    <tab-control class="tab-control" 
                :titles="['流行','新款','精选']"
                @tabClick="tabClick"/>
    <goods-list :goods="showGoods"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/homeSwiper';
  import RecommendView from './childComps/recommendView';
  import FeatureView from './childComps/featureView.vue';

  import NavBar from 'components/common/navbar/NavBar';
  import TabControl from '../../components/content/tabControl/TabControl.vue';
  import GoodsList from '../../components/content/goods/GoodsList.vue';


  import {getHomeMultiData, getHomeGoods} from 'network/home';

  export default {
    name: 'Home',
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop'
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求多个数据
      // 在created写函数的业务逻辑，然后封装到methods写具体实现
      this.getHomeMultiData();

      // 2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    methods: {
      /**
       * 下面是事件监听相关方法
       */
      tabClick(index) {
        // console.log(index);
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
        }
      },

      /**
       * 下面是网络请求相关方法
       */
      getHomeMultiData() {
        getHomeMultiData().then(res => {
          // console.log(res);
          this.banners = res.data.banner;
          this.recommends = res.data.recommend;
        });
      },

      getHomeGoods(type) {
        const page = this.goods[type].page + 1;//到下一页时+1，即可加载下一页
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;
        });
      }
    }
  };
</script>

<style scoped>
  #home {
    padding-top: 44px;
  }

  .home-nav {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    color: #fff;
    background-color: var(--color-tint);
    z-index: 1;
  }

  .tab-control {
    position: sticky;
    top: 44px;
    height: 34px;
    line-height: 34px;
    font-size: 16px;
    color: #000;
    z-index: 1;
  }
</style>