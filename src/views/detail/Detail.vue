<template>
  <div id="detail">
    <detail-nav-bar/>
    <detail-swiper :top-images="topImages"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar';
  import DetailSwiper from './childComps/DetailSwiper.vue';

  import {getDetail} from 'network/detail';
  
  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper   
    },
    data() {
      return {
        iid: null,
        topImages: []
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
        // 1.获取顶部轮播图数据
        this.topImages = res.result.itemInfo.topImages;
      })
    }
  }
</script>

<style scoped>

</style>