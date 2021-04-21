<template>
  <div class="toast" v-show="isShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
  export default {
    name: 'Toast',
    props: {
      // message: {
      //   type: String,
      //   default: ''
      // },
      // show: {
      //   type: Boolean,
      //   default: false
      // }
    },
    data() {
      return {
        message: '',
        isShow: false,
        msgLasted: ''
      }
    },
    methods: {
      show(message = '默认文字', duration = 2000) {
        /**
         * 每次调用该方法时，上次点击“加入购物车”时msgLasted保存了定时器数据，
         * 如果在duration时间内再次点击“加入购物车”，会继续调用show()，
         * 这时先判断msgLasted是否存在：若存在，则清除定时器，
         * 这样做可以在duration时间内连续点击添加后，
         * 最后一次点击完再过duration时间才消失弹窗提示。
         * 如果没有清除定时器，会导致无论连续点击了几次，
         * 都会在duration时间内消失弹窗提示，用户可能在某次点击时就看不到弹窗提示了。
         */
        if (this.msgLasted) {
          clearTimeout(this.msgLasted);
        };

        this.isShow = true;
        this.message = message;

        this.msgLasted = setTimeout(() => {
          this.isShow = false;
          this.message = '';
        }, duration);
      }
    }
  }
</script>

<style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2px 10px;
    text-align: center;
    line-height: 36px;
    color: #fff;
    letter-spacing: 2px;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;/*通过安装插件的方式测试的时候发现toast被盖住了，所以这里设置999 */
  }
</style>