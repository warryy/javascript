function fn(...args) {
  console.log(this.haha, ...args);
}

console.log(fn.call({ haha: 123 }, 1, 2, 3));
console.log(fn.call(undefined, 1, 2, 3));

// function mycall(bindObj, ...args) {
//   const only = Symbol("only");
//   bindObj[only] = this;
//   const res = bindObj[only](...args);
//   delete bindObj[only];
//   return res;
// }

/**
 * 明确需求: 
 *  使用 target 调用 fn, target 可能为 undefined
 */
Function.prototype.mycall = function(target, ...args) {
  const sym = Symbol()
  const bindObj = target || window
  bindObj[sym] = this
  const res = bindObj[sym](...args)
  delete bindObj[sym]
  return res
}

console.log(fn.mycall({ haha: 123 }, 1, 2, 3));
console.log(fn.mycall(undefined, 1, 2, 3));