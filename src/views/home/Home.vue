<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends"/>
    <feature-view/>
    <tab-control :titles="['流行','新款','精选']"/>
    <ul>
      <li>列表1</li>
      <li>列表2</li>
      <li>列表3</li>
      <li>列表4</li>
      <li>列表5</li>
      <li>列表6</li>
      <li>列表7</li>
      <li>列表8</li>
      <li>列表9</li>
      <li>列表10</li>
      <li>列表11</li>
      <li>列表12</li>
      <li>列表13</li>
      <li>列表14</li>
      <li>列表15</li>
      <li>列表16</li>
      <li>列表17</li>
      <li>列表18</li>
      <li>列表19</li>
      <li>列表20</li>
      <li>列表21</li>
      <li>列表22</li>
      <li>列表23</li>
      <li>列表24</li>
      <li>列表25</li>
      <li>列表26</li>
      <li>列表27</li>
      <li>列表28</li>
      <li>列表29</li>
      <li>列表30</li>
      <li>列表31</li>
      <li>列表32</li>
      <li>列表33</li>
      <li>列表34</li>
      <li>列表35</li>
      <li>列表36</li>
      <li>列表37</li>
      <li>列表38</li>
      <li>列表39</li>
      <li>列表40</li>
    </ul>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/homeSwiper';
  import RecommendView from './childComps/recommendView';
  import FeatureView from './childComps/featureView.vue';

  import NavBar from 'components/common/navbar/NavBar';
  import TabControl from '../../components/content/tabControl/TabControl.vue';


  import {getHomeMultiData, getHomeGoods} from 'network/home';

  export default {
    name: 'Home',
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl
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