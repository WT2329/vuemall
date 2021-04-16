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

  import {getDetail, Goods, Shop, GoodsParam} from 'network/detail';
  
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
      DetailCommentInfo
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},// 这里默认为空对象，不能写成null，因为DetailBaseInfo.vue中props传回的是对象
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {}
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