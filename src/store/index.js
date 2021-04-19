import Vue from 'vue';
import Vuex from 'vuex';

// 1.安装插件
Vue.use(Vuex);

// 2.创建Store对象
const store = new Vuex.Store({
  state: {
    cartList: []// 在购物车中放商品信息
  },
  mutations: {
    addCart(state, payload) {
      state.cartList.push(payload);
    }
  }
})

// 3.挂载到Vue实例上
export default store;