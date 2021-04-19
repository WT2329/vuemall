<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList" 
                      :key="index" 
                      :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll';

  import CartListItem from './CartListItem';

  import {mapGetters} from 'vuex';

  export default {
    name: 'CartList',
    components: {
      Scroll,
      CartListItem
    },
    computed: {
      ...mapGetters([
        'cartList'
      ])
    },
    activated() {
      // console.log('----');
      /**
       * 下面要解决添加商品后不能滚动的bug：
       * bug产生的原因是一开始BScroll有自己设定的滚动高度，
       * 如果一开始没有商品的话应该初始设定的高度为0，
       * 而后面我添加商品后，高度改变了，
       * 而BScroll并不知道高度改变了，
       * 因此高度还是当作0，无法滚动。
       */
      this.$refs.scroll.refresh();
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 44px - 49px - 49px); /* 44是navBar，49是tabBar，49是cartButtonBar */
  }

  .content {
    height: 100%;
  }
</style>