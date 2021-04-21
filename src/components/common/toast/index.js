import Toast from './Toast';

const obj ={};

// 通过install注册全局组件
obj.install = function(Vue) {
  // console.log('执行obj的install函数', Vue);

  // 把Toast加载到body里面，让它到时可以显示
  // document.body.appendChild(Toast.$el);// 这样写会报错，因为用install时Toast.$el还没挂载,因此Toast.$el是没有的
  // console.log(Toast.$el);// undefined

  // 因此要用下面的方式做：
  // 1.创建组件构造器
  const toastConstructor = Vue.extend(Toast);

  // 2.new的方式，根据组件构造器，可以创建出一个组件对象
  const toast = new toastConstructor();

  // 3.将组件对象手动挂载到某一个元素上
  toast.$mount(document.createElement('div'));

  // 4.toast.$el对应的就是div
  document.body.appendChild(toast.$el);

  // 5.创建$toast原型，并把导入的Toast对象赋给该原型
  Vue.prototype.$toast = toast;
};

export default obj;