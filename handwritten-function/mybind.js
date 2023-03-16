// /**
//  * 1. 绑定作用域
//  * 2. 实现函数柯里化
//  * 3. 返回的函数作为构造函数时, this 绑定失效
//  */
// function mybind(obj, ...args) {
//   var that = this
//   return function (innerArgs) {
//     return that.call(obj, ...args, ...innerArgs)
//   }
// }

// /**
//  * obj = {a: 1}
//  * var bound = fn.mybind(obj)
//  * 不使用 new 的时候, bound 内部的 this 是指向 obj 的
//  * 使用 new 的时候, this 失效, 依旧是指向 new 操作返回的那个对象
//  *
//  * new bound()
//  *  1. 将返回的参数的原型指向 fn
//  *  2. 将 fn 的原型指向 返回的参数
//  *  3. 将 执行 fn 得到返回结果 res
//  *    1. res !== null && (res 是 function 或着 object), 返回 res
//  *    2. 返回 空的 obj
//  */

function fn(...args) {
  console.log(this.haha, ...args);
}

const newFn = fn.bind({ haha: "haha" }, 2, 3, 4);
console.log(newFn());


