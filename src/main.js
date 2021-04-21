import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import toast from 'components/common/toast';

import FastClick from 'fastclick';

Vue.config.productionTip = false;

// 添加事件总线对象
Vue.prototype.$bus = new Vue();

// 安装toast插件，安装后会执行toast对应的install函数(/common/toast/index.js)
Vue.use(toast);

// 解决移动端300ms延迟
FastClick.attach(document.body);

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');