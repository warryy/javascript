function mycall(bindObj, ...args) {
  const only = Symbol('only')
  bindObj[only] = this
  const res = bindObj[only](...args)
  delete bindObj[only]
  return res
}