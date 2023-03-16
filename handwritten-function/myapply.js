function myapply(bindObj, argsArr) {
  const only = Symbol('only')
  bindObj[only] = this
  const res = bindObj[only](...argsArr)
  delete bindObj[only]
  return res
}

function myapply2(bindObj, argsArr) {
  const only = Math.random()
  bindObj[only] = this
  let res
  if (!argsArr || argsArr.length === 0 ) {
    res = bindObj[only]()
  } else {
    let evalStr = ''
    for (var i = 0; i < argsArr.length; ++i) {
      evalStr += argsArr[i] + ','
    }
    res = eval('bindObj[only](' + evalStr + ')')
  }
  delete bindObj[only]
  return res
}