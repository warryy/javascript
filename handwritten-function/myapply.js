function fn(...args) {
  console.log(this.haha, ...args);
}

console.log(fn.apply({ haha: 'haha' }, [2, 3, 4]))

Object.prototype.myapply = function myapply(obj, args) {
  const sym = Symbol(fn)
  obj[sym] = this
  const res = obj[sym](...args)
  delete obj[sym]
  return res
}

console.log(fn.myapply({ haha: 'haha' }, [2, 3, 4]))

