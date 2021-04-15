<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div class="title-item" 
              v-for="(item, index) in titles" 
              :key="index"
              :class="{active: index === currentIndex}"
              @click="titleClick(index)">
          {{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar';

  export default {
    name: 'DetailNavBar',
    components: {
      NavBar
    },
    data() {
      return {
        titles: ['商品', '参数', '评论', '推荐'],
        currentIndex: 0
      }
    },
    methods: {
      backClick() {
        this.$router.back();
      },
      titleClick(index) {
        this.currentIndex = index;
      }
    }
  }
</script>

<style scoped>
  .back {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .back img {
    width: 15px;
  }

  .title {
    display: flex;
    font-size: 14px;
  }

  .title-item {
    flex: 1;
  }

  .active {
    color: var(--color-high-text);
  }
</style>