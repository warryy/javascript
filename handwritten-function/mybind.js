
function fn(...args) {
  console.log(this.haha, ...args);
}

window.haha = "window haha";

console.log(fn.bind({ haha: "haha" }, 2, 3, 4)(666));

console.log(fn.bind(undefined, 2, 3, 4)(666));

/**
 * 自己实现
 * 明确需求:
 *  fn.bind(a, b, c)
 *  将 fn 改为用 a 调用执行, 且绑定参数 b, c
 * 边界情况
 *  bind 参数为空
 */
Function.prototype.mybind = function (obj, ...args) {
  if (typeof this !== "function") {
    throw Error("mybind is not a function");
  }
  const that = this
  return function (...myArgs) {
    return that.call(obj || window, ...args, ...myArgs);
  };
};

console.log(fn.mybind({ haha: "haha" }, 2, 3, 4)(666));

console.log(fn.mybind(undefined, 2, 3, 4)(666));
