<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            :pull-up-load="true" 
            @scroll="contentScroll" >
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control" 
                  :titles="['流行','新款','精选']"
                  @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <!-- 监听组件时，需要用.native -->
    <back-top @click.native="backTopClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/homeSwiper';
  import RecommendView from './childComps/recommendView';
  import FeatureView from './childComps/featureView';

  import NavBar from 'components/common/navbar/NavBar';
  import TabControl from 'components/content/tabControl/TabControl';
  import GoodsList from 'components/content/goods/GoodsList';
  import Scroll from 'components/common/scroll/Scroll';
  import BackTop from '../../components/content/backTop/BackTop.vue';
  
  import {getHomeMultiData, getHomeGoods} from 'network/home';
  import {debounce} from 'common/utils';

  export default {
    name: 'Home',
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,
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
        currentType: 'pop',
        isShowBackTop: false
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

      // 3.监听GoodsListItem中的每张图片加载完成，使用“事件总线”--$bus，而$bus为undefined，需要在main.js注册
      /*
        使用“事件总线”的原因：Home.vue和Scroll.vue隔得太远，
        因此在Home.vue拿到Scroll.vue对象，在GoodsListItem.vue发送事件给Home.vue，
        Home.vue接收到发过来的事件后，就可以通过scroll对象调用refresh()，
        从而实现每张图片的实时加载
       */
      // this.$bus.$on('itemImageLoad', () => {
      //   // console.log('Home-itemImageLoad');
      //   this.$refs.scroll.refresh();
      // })// 但是在created里面写这个监听，有可能会获取不到$refs.scroll，因此还是放在mounted更好
    },
    mounted() {
      // 因为在common/utils.js导入了debounce()，所以这里debounce不用写成this.debounce
      const refresh = debounce(this.$refs.scroll.refresh, 500);

      this.$bus.$on('itemImageLoad', () => {
        // console.log('Home-itemImageLoad');
        //this.$refs.scroll.refresh();// 这样会一下子调用很多次方法，需要考虑使用防抖函数
        refresh();// 这个函数就是上面const refresh这个函数
      })
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
      backTopClick() {
        // console.log('backTopClick');
        /**
         * 下面第一个scroll是上面模板中的ref="scroll"，
         * 第二个scroll是Scroll.vue中的data中的scroll对象，
         * 最后再调用scrollTo(0, 0, 600)回到滚动部分的顶部，600是600毫秒，
         * 不过这样的写法可能不易理解，所以改用写法
         */
        //this.$refs.scroll.scroll.scrollTo(0, 0, 600);
        /**
         * 改用下面的写法，其中scrollTo()为Scroll.vue中封装的方法
         */
        this.$refs.scroll.scrollTo(0, 0, 800);
      },
      contentScroll(position) {
        // 在这里打印从Scroll.vue传来的定位数据position，需要用到其y值
        // console.log(position);
        this.isShowBackTop = (-position.y) > 600;// 观察打印出来的y值为负数，所以加负号
      },
      // loadMore() {
      //   // console.log('上拉加载更多');
      //   this.getHomeGoods(this.currentType);
      // },


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

          // 调用finishPullUp，使得多次进行网络请求
          // this.$refs.scroll.finishPullUp();
        });
      }
    }
  };
</script>

<style scoped>
  #home {
    padding-top: 44px;
    height: 100vh;
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
    /* position: sticky;
    top: 44px; */
    height: 34px;
    line-height: 34px;
    font-size: 16px;
    color: #000;
    z-index: 1;
  }

  .content {
    height: calc(100% - 49px);
    overflow: hidden;
  }
</style>