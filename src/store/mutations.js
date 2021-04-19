import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types';

export default {
  /**
   * mutations唯一的目的就是修改state的状态，可以在devtools中跟踪到state的状态，
   * mutations中的每个方法尽可能完成的事情是单一的，
   * 像一个方法里面用了if(){}else{}的话(如下面的addCart)，相当于可能做两件事，
   * 这样在vue devtools中观察的时候，会发现每次点击加入购物车，触发addCart，
   * 就每次都会更新一个关于addCart的追踪，
   * 这样判断不了这个addCart是旧商品+1，还是添加新商品。
   * 所以应该“旧商品+1”封装一个方法，“添加新商品”封装一个方法，
   * 这样在devtools看到对应的方法就知道点击“加入购物车”具体是做了什么事情了，
   * 比如旧商品+1封装一个addCounter()。
   * 那么下面的addCart就放在action里面，因为修改状态是有一个逻辑的：
   * 修改components -> 通过actions -> mutations执行 -> 改变state -> 修改好components
   */

  // addCart(state, payload) {
  //   // 需要判断新添加的商品之前是否添加过，避免重复
  //   // 1.payload新添加的商品
  //   // 下面使用for循环可行
  //   // let oldProduct = null;
  //   // for (let item of state.cartList) {
  //   //   if (item.iid === payload.iid) {
  //   //     oldProduct = item;
  //   //   }
  //   // };
  //   // 下面使用数组的高级用法之一find()也可行，且代码量只有一行
  //   let oldProduct = state.cartList.find(item => item.iid === payload.iid);

  //   // 2.判断oldProduct是否存在，存在则商品计数+1，不存在则添加商品且计数赋值为1
  //   if (oldProduct) {
  //     oldProduct.count += 1;
  //   }else {
  //     payload.count = 1;
  //     state.cartList.push(payload);
  //   }
  // }

  [ADD_COUNTER](state, payload) {
    payload.count++;
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = true;
    state.cartList.push(payload);
  }
}