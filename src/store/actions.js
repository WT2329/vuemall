import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types';

export default {
  // 在actions中方法的第一个参数是上下文context
  addCart(context, payload) {
    // 需要判断新添加的商品之前是否添加过，避免重复
    // 1.payload新添加的商品
    // 下面使用for循环可行
    // let oldProduct = null;
    // for (let item of state.cartList) {
    //   if (item.iid === payload.iid) {
    //     oldProduct = item;
    //   }
    // };
    // 下面使用数组的高级用法之一find()也可行，且代码量只有一行
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);

    // 2.判断oldProduct是否存在，存在则商品计数+1，不存在则添加商品且计数赋值为1
    if (oldProduct) {
      // oldProduct.count += 1;
      context.commit(ADD_COUNTER, oldProduct);
    }else {
      payload.count = 1;
      // context.state.cartList.push(payload);
      context.commit(ADD_TO_CART, payload);
    }
  }
}