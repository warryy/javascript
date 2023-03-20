# 手写 Promise

> 重要的是思路, 细节错一点无所谓

## 基本实现

1. 初始化变量, state, value, reason, resolve, reject, onFulfilledCallbacks, onRejectedCallbacks
2. 完成构造函数入参函数的写法
3. thenable 方法

**注意:**
- 永远返回一个 `promise` 对象

- 按照当前 `promise` 的 `state` 进行情况区分

- 注意任何情况都要 `setTimeout` 执行; eg:

```javascript
Promise.resolve(1).then(console.log);
console.log(2);
//  打印顺序: 2, 1
```

- 需要抽象出一个工具函数 `resolvePromise`, 用于解决 `onFulfilled` 函数返回值的三大类情况:
1. 和原 `promise` 相同
2. 是一个 `thenable` 的对象或者函数
3. 是一个新的 `promise` 对象

## 进阶补充(完善方法)
### `resolve` & `reject` & `catch`
很简单, 直接看代码就好

### `all`