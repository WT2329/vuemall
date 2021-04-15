export function debounce(func, delay) {
  let timer = null;
  return function(...args) {// 这里...args有三个点，说明可以传入多个参数
    if (timer) {
      clearTimeout(timer);
    };
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  }
}