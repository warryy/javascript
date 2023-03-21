# 手写 Promise

> 重要的是思路, 细节错一点无所谓
> [promiseA+文档](https://promisesaplus.com/)
> [测试用例工具](https://github.com/promises-aplus/promises-tests)

## 基本实现

1. 初始化变量, state, value, reason, resolve, reject, onFulfilledCallbacks, onRejectedCallbacks
2. 完成构造函数入参函数的写法
3. thenable 方法
4. 时刻记住 then 函数是有两个回调函数参数的

**注意:**

- 永远返回一个 `promise` 对象

- 按照当前 `promise` 的 `state` 进行情况区分

- 注意任何情况都要 `setTimeout` 执行; eg:

```javascript
Promise.resolve(1).then(console.log);
console.log(2);
//  打印顺序: 2, 1
```

- 需要抽象出一个工具函数 `resolvePromise(promise, x, resolve, reject)`, 用于解决 `onFulfilled` 函数返回值的三大类情况:

1. 和原 `promise` 相同
2. 是一个 `thenable` 的对象或者函数
3. 是一个新的 `promise` 对象
4. 如果 `x` 的值是一个具有 `then` 属性的函数或者对象且 `then` 是函数, 那就要用 `x` 去调用 `then`, 调用方式和调用 `Promise.prototype.then` 的方式一样

## 进阶补充(完善方法)

### `resolve` & `reject` & `catch`

- `resolve` & `reject` 为函数自带方法
  很简单, 直接看代码就好

### `all` & `race`

- 函数自带方法
- `then` 中统计已经 `fulfilled` 的 `promise` 个数
- 注意 `all` 参数传入空数组的边界情况
- `race` 是 `all` 的简化版

### `finally`

- 要返回一个 `Promise` 对象, 因为 `finally` 也可以链式调用

### `allSettled`

- 类比 `all` 的实现
