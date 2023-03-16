/**
 * 1. 新建一个用于返回的对象 res
 * 2. 将 res 的原型指向 fn
 * 3. 将 fn 的 this 指向 res 并运行 fn, 并记录返回值 fnRes
 * 4. 若 fnRes 不是 null 且 fnRes 是函数或者对象, 则返回 fnRes, 否则直接返回空对象
 */
function mynew(fn, ...args) {
  const obj = new Object()
  obj.__proto__ = fn.prototype
  const res = fn.apply(obj, args)
  if (res !== null && (typeof res === 'object' || typeof res = 'function')) {
    return res
  }
  return obj
}