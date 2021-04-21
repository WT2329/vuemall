<template>
  <div class="goods-item" @click="itemClick">
    <img v-lazy="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GoodsListItem",
    props: {
      goodsItem: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      showImage() {
        return this.goodsItem.image || this.goodsItem.show.img;
      }
    },
    methods: {
      imageLoad() {
        // console.log('imageLoad');
        /**
         * 思路1：因为Home.vue和Detail.vue中都有GoodsListItem.vue的引用，
         * 而只监听一个事件不能做到分别在两者进行监听，
         * 所以下面通过判断路由来选择监听哪一个事件，从而刷新高度。
         */
        // if (this.$route.path.indexOf('/home')) {
        //   this.$bus.$emit('homeItemImageLoad');
        // }else if (this.$route.path.indexOf('/detail')) {
        //   this.$bus.$emit('detailItemImageLoad');
        // }

        /**
         * 思路2：下面这个方法使用mixin
         * 当Home.vue离开时取消全局事件监听(在deactivated)
         */
        this.$bus.$emit('itemImageLoad');
      },
      itemClick() {
        // console.log('跳转到详情页');
        this.$router.push('/detail/' + this.goodsItem.iid);
      }
    }
  }
</script>

<style scoped>
  .goods-item {
    position: relative;
    padding-bottom: 40px;
    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
    font-size: 12px;
  }

  .goods-info p {
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px no-repeat;
  }
</style>
