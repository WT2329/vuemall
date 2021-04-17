<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo"/>
      <detail-comment-info :comment-info="commentInfo"/>
      <goods-list :goods="recommends"/>
    </scroll>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar';
  import DetailSwiper from './childComps/DetailSwiper';
  import DetailBaseInfo from './childComps/DetailBaseInfo';
  import DetailShopInfo from './childComps/DetailShopInfo';
  import DetailGoodsInfo from './childComps/DetailGoodsInfo';
  import DetailParamInfo from './childComps/DetailParamInfo';
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue';

  import Scroll from 'components/common/scroll/Scroll';
  import GoodsList from 'components/content/goods/GoodsList.vue';

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail';
  import {itemListenerMixin} from 'common/mixin';
  
  export default {
    name: 'Detail',
    components: {
      Scroll,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList
    },
    mixins: [
      itemListenerMixin
    ],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},// 这里默认为空对象，不能写成null，因为DetailBaseInfo.vue中props传回的是对象
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: []
      }
    },
    created() {
      /**
       * 由于在App.vue中用keep-alive包住了router-view，
       * 导致详情页的数据请求了第一次之后，
       * 再点击别的详情，还是获取了第一次请求的数据，
       * 这时需要在keep-alive设置exclude="Detail"，把Detail.vue排除
       */
      // 1.保存传入的iid
      this.iid = this.$route.params.iid;

      // 2.根据iid请求详情数据
      getDetail(this.iid).then((res) => {
        // console.log(res);
        const data = res.result;
        // 1.获取顶部轮播图数据
        this.topImages = data.itemInfo.topImages;

        // 2.获取商品数据
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

        // 3.获取店铺数据
        this.shop = new Shop(data.shopInfo);

        // 4.获取商品详细数据
        this.detailInfo = data.detailInfo;

        // 5.获取参数数据
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

        // 6.获取评论与其它推荐数据
        if (data.cRate != 0) {
          this.commentInfo = data.rate.list[0];
        }
      })
    
      // 3.请求登陆数据
      getRecommend().then((res) => {
        // console.log(res);
        this.recommends = res.data.list;
      })
    },
    mounted() {
      /**
       * 现在在Home.vue和Detail.vue里面的mounted中，
       * 都有相同的代码，现在需要用混入技术(mixin)，把相同代码抽取出来放到一个公共位置，
       * 在这里可能想到用类的继承来抽取相同代码，
       * 但是现在是两个export default {}，这是对象，不能用继承
       */
      // const refresh = debounce(this.$refs.scroll.refresh, 500);

      // this.itemImageListener = () => {
      //   refresh();
      // };

      // this.$bus.$on('itemImageLoad', this.itemImageListener);
    },
    destroyed() {
      // 因为Detail.vue在App.vue中没有做缓存，所以用deactivated记录离开是不行的
      this.$bus.$off('itemImageLoad', this.itemImageListener);
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh();
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    height: 100vh;
    background-color: #FFF;
    overflow: hidden;
    z-index: 3;
  }

  .detail-nav {
    position: relative;
    background-color: #fff;
    z-index: 1;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>