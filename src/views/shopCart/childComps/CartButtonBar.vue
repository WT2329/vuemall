<template>
  <div class="button-bar">
    <div class="checked-all">
      <check-button class="checked-button"/>
      <span>全选</span>
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton';

  export default {
    name: 'CartButtonBar',
    components: {
      CheckButton
    }
  }
</script>

<style scoped>
  .button-bar {
    position: relative;
    padding: 0 10px;
    height: 49px;
    /* bottom: 40px; */
    box-shadow: 0 -1px 4px rgba(100, 100, 100, 0.1);
    background-color: #fff;
  }

  .checked-all {
    display: flex;
    align-items: center;
    height: 49px;
  }

  .checked-button {
    margin-right: 5px;
    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 20px;
  }
</style>