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
        isShow: false
      }
    },
    methods: {
      show(message = '默认文字', duration = 2000) {
        this.isShow = true;
        this.message = message;

        setTimeout(() => {
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