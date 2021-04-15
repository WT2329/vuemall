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
      pullUpLoad: {
        type: Boolean,
        default: false
      }
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
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          // console.log(position);
          this.$emit('scroll', position);// 自定义事件'scroll'，把position传出去，让Home.vue接到
        })
      }

      // console.log(this.scroll);

      // 3.监听上拉时间
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          // console.log('上拉加载更多');
          this.$emit('pullingUp');//发送自定义事件pullingUp至Home.vue，让Home.vue再次发送网络请求
        })
      }
    },
    methods: {
      // ES6中，第三个参数time如果赋值，则该值为默认值
      scrollTo(x, y, time = 600) {
        // this.scroll.scrollTo(x, y, time);
        /**
         * 因为网速的问题，在组件创建完后，就立即发送网络请求，加载图片，
         * 而scroll对象通过mounted挂载，有可能没有图片的加载速度快，
         * 也就是说可能图片加载完后，scroll对象还没挂载出来，相当于scroll = null，
         * 因此Home.vue中通过$refs找到的scroll对象为空，
         * 也就调用不了scrollTo()和refresh()，导致报错。
         * 这样的报错是由网速决定的，但是可以使用&&来解决，如下：
         * this.scroll && this.scroll.scrollTo(x, y, time);
         * 这样写的作用：从左到右执行，先看this.scroll存不存在，如果存在，返回true，
         * 继续向右执行scrollTo()，这样就避免了因为scroll为空而报错。下面的同理。
         */
        this.scroll && this.scroll.scrollTo(x, y, time);
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0;
      }
    }
  }
</script>

<style scoped>

</style>