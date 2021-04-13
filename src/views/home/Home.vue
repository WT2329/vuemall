<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends"/>
    <feature-view/>
    <tab-control :titles="['流行','新款','精选']"/>
    <goods-list :goods="goods['pop'].list"/>
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
        }
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
</style>