import {request} from "./request";

export function getHomeMultiData() {
  return request({
    url: '/home/multidata'
  })
}

export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}

// // 为变量赋数组
// // 1.for循环
// let totalNums = []

// const nums1 = [1, 2, 3]
// const nums2 = [4, 5, 6]

// for (let n of num1) {
//   totalNums.push(n)
// }

// // 2.push语法
// totalNums.push(...nums1)