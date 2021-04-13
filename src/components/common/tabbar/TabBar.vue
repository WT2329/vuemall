<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'TabBar'
  }
</script>

<style scoped>
  #tab-bar {
    position: fixed;
    display: flex;
    right: 0;
    left: 0;
    bottom: 0;
    box-shadow: 0 -1px 4px rgba(100, 100, 100, 0.1);
    background: #f6f6f6;
    z-index: 2;
  }
</style>
