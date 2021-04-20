<template>
  <div class="button-bar">
    <div class="checked-all">
      <check-button class="checked-button" 
                    :is-checked="isSelectedAll"
                    @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{totalPrice}}
    </div>

    <div class="calculate">
      结算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton';

  import {mapGetters} from 'vuex';

  export default {
    name: 'CartButtonBar',
    components: {
      CheckButton
    },
    computed: {
      // 引入mapGetters后，可以省略$store.state
      ...mapGetters([
        'cartList'
      ]),

      totalPrice() {
        // return '￥' + this.$store.state.cartList.filter((item) => {
        //   return item.checked;
        // }).reduce((preValue, item) => {
        //   return preValue + item.price * item.count;
        // }, 0).toFixed(2);
        return '￥' + this.cartList.filter(item => {
          return item.checked;
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count;
        }, 0).toFixed(2);
      },

      checkLength() {
        // return this.$store.state.cartList.filter((item) => item.checked).length;
        return this.cartList.filter(item => item.checked).length;
      },

      isSelectedAll() {
        // 一开始没有添加购物车时，数组长度为0，返回false表示不选中全选按钮。
        if (this.cartList.length === 0) {
          return false;
        };

        // 1.使用普通遍历
        // for (let item of this.cartList) {
        //   if (!item.checked) {
        //     return false;
        //   };
        // };

        // return true;

        /**
         * 2.使用filter()：
         * !item.checked是取没选中的，
         * filter(item => !item.checked).length取没选中的数组的长度，
         * 如果长度存在，说明不是全选，会返回true，
         * 因此整体取反，这样就返回false，全选按钮不会被选中。
         * 但是使用filter()的话，本质上是循环遍历出所有选项，这样性能不够好，
         * 可以使用find()，这样只要找到一条符合条件的数据，返回即可，
         * 而且find()是看有没有找到数据，因此不需要在后面加.length来获取数组长度。
         */
        // return !(this.cartList.filter(item => !item.checked).length);

        // 3.使用find()，找到一条数据符合即可，无需循环导致性能增加。
        return !(this.cartList.find(item => !item.checked));
      }
    },
    methods: {
      /**
       * 点击全选按钮：
       * 情况1.原来全选，点一下变成全不选；
       * 情况2.原来全不选或部分没选，点一下变成全选。
       */
      checkClick() {
        // console.log('----');
        if (this.isSelectedAll) {// 全部选中
          this.cartList.forEach(item => {
            item.checked = false;
          });
        }else {// 全部或部分没被选中
          this.cartList.forEach(item => {
            item.checked = true;
          });
        };
      }
    }
  }
</script>

<style scoped>
  .button-bar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 49px;
    /* bottom: 40px; */
    box-shadow: 0 -1px 4px rgba(100, 100, 100, 0.1);
    font-size: 15px;
    background-color: #fff;
  }

  .checked-all {
    display: flex;
    align-items: center;
    flex: 1;
    height: 49px;
  }

  .checked-button {
    margin-right: 5px;
    width: 22px;
    height: 22px;
    text-align: center;
    line-height: 22px;
  }

  .price {
    flex: 2;
    padding-right: 5px;
    text-align: right;
  }

  .calculate {
    flex: 0.8;
    width: 70px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    border-radius: 17px;
    color: #fff;
    background: var(--color-tint);
    overflow: hidden;
  }
</style>