<template>
  <!-- ref绑定在组件,下面可以通过$refs获取到该组件对象 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'Scroll',
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      // pullUpLoad: {
      //   type: Boolean,
      //   default: false
      // }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      /**
       * 用querySelector('.wrapper')和('.wrapper')获取的元素可能会出问题，
       * 因为可能在别的dom元素里面也命名了class="wrapper"，
       * 这样就说不准获取到的.wrapper是不是我想要那个的了，
       * 因此用ref
       */
      // 1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,// 这里的值默认为0，不为2或3是因为有的使用者不需要监听，设置2或3反而影响性能
        click: true,// 对于button无论true或false都能点击，但是div要点击的话需要设置true
        pullUpLoad: this.pullUpLoad,// 这里如果直接设置pullUpLoad: true，相当于自带probeType: 3
      })

      // 2.监听滚动位置
      this.scroll.on('scroll', (position) => {
        // console.log(position);
        this.$emit('scroll', position);// 自定义事件'scroll'，把position传出去，让Home.vue接到
      })

      // console.log(this.scroll);

      // this.scroll.refresh();

      // 3.监听上拉时间
      // this.scroll.on('pullingUp', () => {
      //   // console.log('上拉加载更多');
      //   this.$emit('pullingUp');//发送自定义事件pullingUp至Home.vue，让Home.vue再次发送网络请求
      // })
    },
    methods: {
      // ES6中，第三个参数time如果赋值，则该值为默认值
      scrollTo(x, y, time = 600) {
        this.scroll.scrollTo(x, y, time);
      },
      finishPullUp() {
        this.scroll.finishPullUp();
      },
      refresh() {
        this.scroll.refresh();
      }
    }
  }
</script>

<style scoped>

</style>