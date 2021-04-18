<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <tab-control  class="tab-control"
                  ref="tabControl1"
                  :titles="['流行','新款','精选']"
                  @tabClick="tabClick"
                  v-show="isTabFixed"/>

    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            :pull-up-load="true" 
            @scroll="contentScroll" 
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control  ref="tabControl2"
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
  
  import {getHomeMultiData, getHomeGoods} from 'network/home';
  import {POP, NEW, SELL} from "common/const";
  import {itemListenerMixin, backTopMixin} from 'common/mixin';

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
    },
    mixins: [
      itemListenerMixin,
      backTopMixin
    ],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: POP,
        tabOffsetTop: 0,
        isTabFixed: false,
        // isShowBackTop: false,// Home和Detail都有，故通过混入导入
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
      // console.log('activated');
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
      /*
        下面在回到Home.vue时进行一次刷新，如果不刷新可能会出小问题，
        比如回到后第一次滑动不生效，第二次滑动才生效。
      */
      this.$refs.scroll.refresh();
    },
    deactivated() {
      // console.log('deactivated');
      // 1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY();

      // 2.取消全局事件监听
      /**
       * 下面要传入两个参数，
       * 第一个是要取消的监听事件，
       * 第二个是要取消的监听事件中的哪一个函数(refresh()),
       * 如果不传入第二个参数，那么就会取消掉所有该事件监听。
       */
      this.$bus.$off('itemImageLoad', this.itemImageListener);
    },
    created() {
      // 1.请求多个数据
      // 在created写函数的业务逻辑，然后封装到methods写具体实现
      this.getHomeMultiData();

      // 2.请求商品数据
      this.getHomeGoods(POP);
      this.getHomeGoods(NEW);
      this.getHomeGoods(SELL);

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
      // 下面的关于itemImageLoad和refresh的代码通过mixin抽取出来了
      // 图片加载完成的事件监听
      // 因为在common/utils.js导入了debounce()，所以这里debounce不用写成this.debounce
      // const refresh = debounce(this.$refs.scroll.refresh, 500);

      // // 对refresh()做一层封装，itemImageListener在data中先定义一个空值
      // this.itemImageListener = () => {
      //   // console.log('Home-itemImageLoad');
      //   //this.$refs.scroll.refresh();// 这样会一下子调用很多次方法，需要考虑使用防抖函数
      //   refresh();// 这个函数就是上面const refresh这个函数
      // };

      // this.$bus.$on('itemImageLoad', this.itemImageListener);

    },
    methods: {
      /**
       * 下面是事件监听相关方法
       */ 
      tabClick(index) {
        // console.log(index);
        switch (index) {
          case 0:
            this.currentType = POP;
            break;
          case 1:
            this.currentType = NEW;
            break;
          case 2:
            this.currentType = SELL;
            break;
        }
        /*
          看下面关于两个tabControl的解释，这里要解决bug，
          给两个tabControl都赋值index，
          那么两个tabControl的点击情况都同步了。
        */
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      // backTopClick() {
      //   // console.log('backTopClick');
      //   /**
      //    * 下面第一个scroll是上面模板中的ref="scroll"，
      //    * 第二个scroll是Scroll.vue中的data中的scroll对象，
      //    * 最后再调用scrollTo(0, 0, 600)回到滚动部分的顶部，600是600毫秒，
      //    * 不过这样的写法可能不易理解，所以改用写法
      //    */
      //   //this.$refs.scroll.scroll.scrollTo(0, 0, 600);
      //   /**
      //    * 改用下面的写法，其中scrollTo()为Scroll.vue中封装的方法
      //    */
      //   this.$refs.scroll.scrollTo(0, 0, 600);
      // },
      contentScroll(position) {
        // 1.判断backTop是否显示
        // 在这里打印从Scroll.vue传来的定位数据position，需要用到其y值
        // console.log(position);
        // this.isShowBackTop = (-position.y) > BACK_TOP_DISTANCE;// 观察打印出来的y值为负数，所以加负号
        this.listenShowBackTop(position);// 这里是对上一句代码效果的mixin的混合使用
 
        // 2.决定tabControl是否吸顶，这里原先使用position: fixed，后来因为BScroll导致不显示，就不用fixed了
        /**
         * 下面控制isTabFixed的是否，决定tabControl1是否显示，
         * 当tabControl1显示的时候，刚好造成tabControl2吸顶的假象，
         * 也就是目前的方案是：有一个tabControl1和tabControl2，
         * tabControl1默认隐藏，tabControl2在BScroll里面，
         * 当tabControl2网上移动到(-position.y) > this.tabOffsetTop这种情况时，
         * tabControl2会继续往上移动，但是tabControl1会显示出来，
         * 这样tabControl1就盖住了tabControl2，并且一直停留在top: 44px的位置，
         * 这样就实现了吸顶效果，相当于偷天换日。
         * 但是这样做要解决两个tabControl点击按钮的同步。
         */
        this.isTabFixed = (-position.y) > this.tabOffsetTop;
      },
      loadMore() {
        // console.log('上拉加载更多');
        this.getHomeGoods(this.currentType);
      },
      swiperImageLoad() {
        // 获取tabControl的offsetTop
        // 所有的组件都有一个属性$el，用于获取组件中的元素
        // console.log(this.$refs.tabControl.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
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

          // 完成上拉加载更多后，调用finishPullUp，使得多次进行网络请求
          this.$refs.scroll.finishPullUp();
        });
      }
    }
  };
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
  }

  .home-nav {
    /* position: fixed;// 当时使用了浏览器的原生滚动，所以才设置fixed，但现在BScroll可以局部滚动，则无需设置fixed
    top: 0;
    right: 0;
    left: 0; */
    color: #fff;
    background-color: var(--color-tint);
    /* z-index: 1; */
  }

  .tab-control {
    position: relative;
    z-index: 1;
  }

  .content {
    /* height: calc(100% - 49px); */
    position: absolute;
    top: 44px;
    right: 0;
    bottom: 49px;
    left: 0;
    overflow: hidden;
  }
</style>