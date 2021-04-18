<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick"/>

    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommends" :goods="recommends"/>
    </scroll>

    <detail-bottom-bar/>

    <back-top @click.native="backTopClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar';
  import DetailSwiper from './childComps/DetailSwiper';
  import DetailBaseInfo from './childComps/DetailBaseInfo';
  import DetailShopInfo from './childComps/DetailShopInfo';
  import DetailGoodsInfo from './childComps/DetailGoodsInfo';
  import DetailParamInfo from './childComps/DetailParamInfo';
  import DetailCommentInfo from './childComps/DetailCommentInfo';
  import DetailBottomBar from './childComps/DetailBottomBar';

  import Scroll from 'components/common/scroll/Scroll';
  import GoodsList from 'components/content/goods/GoodsList';

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail';
  import {debounce} from 'common/utils';
  import {itemListenerMixin, backTopMixin} from 'common/mixin';
  
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
      GoodsList,
      DetailBottomBar,
    },
    mixins: [
      itemListenerMixin,
      backTopMixin
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
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // isShowBackTop: false// Home和Detail都有，故通过混入导入
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

        /**
         * 获取offsetTop思路2：
         * 下面的代码因为放在mounted里面获取不到正确数据，
         * 故尝试放在created里面，经过测试还是获取不到正确数据，
         * 因为即使上面的数据获取到后，接着在子组件中拿到并渲染dom，
         * 这个渲染过程会调用update方法，是需要时间的，
         * 因此也不能在子组件获取到数据后就能在本组件获取offsetTop的值。
         * 接着在update()里面试试。
         */
        // this.themeTopYs.push(0);// 第一个组件是轮播图，其顶部距离为0
        // this.themeTopYs.push(-this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(-this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(-this.$refs.recommends.$el.offsetTop);
        // console.log(this.themeTopYs);

        /**
         * 获取offsetTop思路4：
         * 使用$nextTick()，可以在子组件的dom渲染完后调用。
         */
        // this.$nextTick(() => {
        //   /**
        //    * 根据最新的数据，对应的dom已经被渲染出来了，
        //    * 但是相应的图片还没加载完，
        //    * 之所以不断刷新能获取到正确的值，是因为浏览器对数据有缓存，
        //    * 一旦返回再重新进入的时候，又得重新向服务器请求数据，
        //    * 这时拿到的offsetTop还是可能不正确的，因此罪魁祸首是图片的加载问题，
        //    * 解决的办法是：等所有图片加载完后再重新赋值。
        //    * 接着在methods里面试试。
        //    */
        //   // this.themeTopYs = [];// 如果不写这句，update会不断更新数据，往数据里面塞数据，造成数据传入了8个值，因此写这句能使每次更新的时候先让该数组为空，再赋值
        //   // this.themeTopYs.push(0);// 第一个组件是轮播图，其顶部距离为0
        //   // this.themeTopYs.push(-this.$refs.params.$el.offsetTop);
        //   // this.themeTopYs.push(-this.$refs.comment.$el.offsetTop);
        //   // this.themeTopYs.push(-this.$refs.recommends.$el.offsetTop);
        //   // console.log(this.themeTopYs);
        // });
      })
    
      // 3.请求登陆数据
      getRecommend().then((res) => {
        // console.log(res);
        this.recommends = res.data.list;
      })

      // 4.防抖：给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];// 如果不写这句，update会不断更新数据，往数据里面塞数据，造成数据传入了8个值，因此写这句能使每次更新的时候先让该数组为空，再赋值
        this.themeTopYs.push(0);// 第一个组件是轮播图，其顶部距离为0
        this.themeTopYs.push(-this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(-this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(-this.$refs.recommends.$el.offsetTop);
        this.themeTopYs.push(-Number.MAX_VALUE);// 看下面的if语句判断的优化分析，在这里为数组加一个很大的值
        // console.log(this.themeTopYs);
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

      // 根据点击navBar按钮滚动到相应组件
      /**
       * 获取offsetTop思路1：
       * 下面的代码在mounted里面是获取不到正确的Y值的，
       * 因为有的组件用了判断，类似于Object.keys(paramInfo).length !== 0，
       * 也就是说当有数据传进来的时候才渲染这个组件，
       * 而数据是通过created异步请求的，不能保证数据及时传过来，
       * 那么在mounted里面获取到的$el(dom)相当于不存在，也自然获取不到offsetTop。
       * 接着在created()里面试试。
       */
      // this.themeTopYs.push(0);// 第一个组件是轮播图，其顶部距离为0
      // this.themeTopYs.push(-this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(-this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(-this.$refs.recommends.$el.offsetTop);
      // console.log(this.themeTopYs);
    },
    updated() {
      // 只要有数据变化，就会调用updated进行更新
      /**
       * 获取offsetTop思路3：
       * 经过测试，在updated里面写下面的代码获取offsetTop是可行的，
       * 不过因为网速问题，有些图片没加载完，导致offsetTop可能不会第一次就获取到正确值，
       * 可能要刷新几次等图片完全加载完才能获取到正确的offsetTop，
       * 接着继续回created()试试，使用$nextTick()。
       */
      // this.themeTopYs = [];// 如果不写这句，update会不断更新数据，往数据里面塞数据，造成数据传入了8个值，因此写这句能使每次更新的时候先让该数组为空，再赋值
      // this.themeTopYs.push(0);// 第一个组件是轮播图，其顶部距离为0
      // this.themeTopYs.push(-this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(-this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(-this.$refs.recommends.$el.offsetTop);
      // console.log(this.themeTopYs);
    },
    destroyed() {
      // 因为Detail.vue在App.vue中没有做缓存，所以用deactivated记录离开是不行的
      this.$bus.$off('itemImageLoad', this.itemImageListener);
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh();

        /**
         * 获取offsetTop思路5：
         * 在imageLoad()里面执行下面的代码来获取offsetTop，
         * 这样就可以在每次图片加载完后都获取一次值，从而拿到最后正确的值。
         * 但是这样做有可能会获取多次数据，增加服务器压力，因此使用防抖。
         */
        // this.themeTopYs = [];// 如果不写这句，update会不断更新数据，往数据里面塞数据，造成数据传入了8个值，因此写这句能使每次更新的时候先让该数组为空，再赋值
        // this.themeTopYs.push(0);// 第一个组件是轮播图，其顶部距离为0
        // this.themeTopYs.push(-this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(-this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(-this.$refs.recommends.$el.offsetTop);
        // console.log(this.themeTopYs);
        // 上面的几行代码已经写在了debounce()中，并赋值给了getThemeTopY。
        this.getThemeTopY();
      },

      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, this.themeTopYs[index], 600);
      },

      contentScroll(position) {
        // 该方法用于滚动内容时，比如滚动到参数部分，navBar的按钮会在“参数”这里标记出来。
        // console.log(position);
        // 1.获取y值
        const positionY = -position.y;

        // 2.positionY和navBar按钮对应的值进行对比(themeTopYs中的四个值)
        /**
         * 比如：themeTopYs = [0, -13797, -15079, -15295]
         * positionY = [0, -13797)  => index = 0,
         * positionY = [-13797, -15079)  => index = 1,
         * positionY = [-15079, -15295)  => index = 2,
         * positionY = [-15295, ∞)  => index = 3,
         */
        let themeLength = this.themeTopYs.length; 
        for (let i = 0; i < themeLength - 1; i++) {
          // console.log(i);// 这里打印出的i，看起来是数字，实则是字符串String，这样类似于0+1是等于01的
          /**
           * 因此下面的代码中，i需要转换为数字类型：
           * 方法1：可以i*1；
           * 方法2：parseInt(i)；
           * 方法3：let i in this.themeTopYs写成let i = 0; this.themeTopYs.length; i++形式，这样获取到的i是数字类型。
           * 这里选择用方法3
           */
          /**
           * 下面使用了data()中的currentIndex作为判断的条件之一，
           * 默认currentIndex为0，然后先是this.currentIndex !== i做个判断，
           * 这样判断的话，就能做到当i值变化才打印一次值。
           * 其实它内部还是会循环那么多次，只是打印的频率减少到一次而已。
           */
          // if (this.currentIndex !== i 
          // && ((i < themeLength - 1 && positionY >= -this.themeTopYs[i] && positionY < -this.themeTopYs[i+1]) 
          // || (i === themeLength - 1 && positionY >= -this.themeTopYs[i]))) {
          //   // console.log(i);// 直接在这里打印导致打印结果很频繁，如果希望当有变化时才打印一次即可，这里需要做一个判断
          //   this.currentIndex = i;
          //   // console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex = this.currentIndex;
          // }
          /**
           * 对上面的代码作优化：
           * 把上面的themeTopYs的逻辑在if语句作判断时归为一类，
           * 即在[-15295, ∞)这里的∞给一个确定的很大的值，
           * 也就是在数组中多加一个很大的值：
           * themeTopYs = [0, -13797, -15079, -15295, 很大的值]，
           * 这样就不用另外对index=3的情况再加一个判断了，
           * 在js中，可以用Number.MAX_VALUE来表示一个很大的值。
           * 比如：themeTopYs = [0, -13797, -15079, -15295, Number.MAX_VALUE]，
           * positionY = [0, -13797)  => index = 0，
           * positionY = [-13797, -15079)  => index = 1，
           * positionY = [-15079, -15295)  => index = 2，
           * positionY = [-15295, ∞)  => index = 3。
           * 记得在上面for循环()里面的i < themeLength要减1，因为MAX_VALUE不用去遍历。
           * 虽然往数组里面增加一个很大的数会多占用一点内存，
           * 但是这个MAX_VALUE是用二进制来储存，并不会占用很大的空间，
           * 反而没有这个MAX_VALUE而导致if语句判断的条件增多会造成性能的下降，
           * 这就是用空间换时间。
           */
          if (this.currentIndex !== i 
          && (positionY >= -this.themeTopYs[i] && positionY < -this.themeTopYs[i+1])) {
              this.currentIndex = i;
              // console.log(this.currentIndex);
              this.$refs.nav.currentIndex = this.currentIndex;
          }

          // 3.是否显示返回顶部
          this.listenShowBackTop(position);
        }
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
      // }
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