<template>
  <swiper>
    <swiper-item v-for="(item, index) in banners.list" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: "HomeSwiper",
    props: {
      banners: {
        // type: Array,//不知道为什么加了这个后会报错，但轮播图显示正常
        default() {
          return []
        }
      }
    },
    data() {
      return {
        isLoad: false
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    methods: {
      imageLoad() {
        // console.log('imageLoad');
        // 加一个判断，控制变量isLoad的是否，从而只发送一次事件监听，如果不加判断会发送四次事件监听
        if (!this.isLoad) {
          this.$emit('swiperImageLoad');
          this.isLoad = true;
        }
      }
    }
  }
</script>

<style scoped>

</style>