<template>
  <div class="check-button" :class="{checked: isChecked}">
    <img src="~assets/img/cart/tick.svg" alt="">
  </div>
</template>

<script>
  export default {
    name: 'CheckButton',
    props: {
      isChecked: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .check-button {
    border: 3px solid #f2d9e6;
    border-radius: 50%;
  }

  .checked {
    border-color: #ff8c66;
    background-color: #ff8c66;
  }
</style>