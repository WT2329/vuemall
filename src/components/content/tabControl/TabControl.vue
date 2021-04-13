<template>
  <div class="tab-control">
    <div v-for="(item, index) in titles" 
    :key="index" 
    class="tab-control-item" 
    :class="{active: index === currentIndex}" 
    @click="itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabControl',
    props: {
      titles: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        currentIndex: 0
      }
    },
    methods: {
      itemClick(index) {
        this.currentIndex = index
      }
    }
  }
</script>

<style scoped>
  .tab-control {
    position: sticky;
    display: flex;
    top: 44px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    font-size: 16px;
    color: #000;
    background-color: #fff;
    z-index: 1;
  }

  .tab-control-item {
    flex: 1;
  }

  .tab-control-item span {
    padding: 5px;
  }

  .active {
    color: var(--color-high-text);
  }

  .active span {
    border-bottom: 3px solid var(--color-tint);
  }
</style>