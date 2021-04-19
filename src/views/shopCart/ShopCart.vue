<template>
  <div class="cart">
    <!-- 购物车导航 -->
    <nav-bar class="cart-nav">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!-- 购物车列表 -->
    <cart-list/>
    
    <!-- 购物车底部汇总 -->
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar';

  import CartList from './childComps/CartList';

  import {mapGetters} from 'vuex';

  export default {
    name: 'ShopCart',
    components: {
      NavBar,
      CartList
    },
    computed: {
      // 下面是一开始的写法
      // cartLength() {
      //   return this.$store.getters.cartLength;
      // }

      // 下面的方法不直接在计算属性中写出来，而是通过vuex的mapGetters把写在getters.js中的计算属性相关方法放到这里面
      // ...mapGetters([
      //   'cartLength',
      //   'cartList'
      // ])

      // 下面可自定义从getter.js拿过来的计算属性方法的名称，注意数组[]要写成对象{}形式
      ...mapGetters({
        length: 'cartLength'
      })
    }
  }
</script>

<style scoped>
  .cart-nav {
    font-weight: 600;
    color: #fff;
    letter-spacing: 2px;
    background-color: var(--color-tint);
  }
</style>