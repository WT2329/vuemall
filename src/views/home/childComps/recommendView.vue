<template>
  <div class="recommend">
    <div v-for="(item, index) in recommends.list" :key="index" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RecommendView',
    props: {
      recommends: {
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .recommend {
    display: flex;
    padding: 10px 0 15px 0;
    border-bottom: 10px solid #eee;
    text-align: center;
    font-size: 14px;
  }

  .recommend-item {
    flex: 1;
  }

  .recommend-item img {
    margin-bottom: 10px;
    width: 65px;
    height: 65px;
  }
</style>