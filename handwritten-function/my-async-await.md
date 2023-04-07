# 先看需求

我们是要实现 async await 函数的效果, 具体如下

```js
function fn(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num + 1);
    }, 1000);
  });
}

async function asyncFn(num) {
  const num1 = await fn(num);
  console.log(num1); // 2
  const num2 = await fn(num1);
  console.log(num2); // 4
  const num3 = await fn(num2);
  console.log(num3); // 8
  return num3;
}

const asyncRes = asyncFn(1);
console.log(asyncRes); // Promise
asyncRes.then((res) => console.log(res)); // 8
```

# 拆解需求

1. `asyncFn` 函数要是同步执行异步操作的形式
2. 定义新函数 `produce`, 参数为 `asyncFn`, 用于处理 `asyncFn` 函数中 `field` 关键字的顺序调用执行问题, 且返回值是一个函数 `fn`, `fn` 的返回值是一个 `Promise` 对象

# 思路

1. 通过 `generator` 函数实现 `asyncFn`
2. 通过 `Promise.then` 方法依次调用 `yield` 实现代码的顺序执行

```js
function fn(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num + 1);
    }, 1000);
  });
}

function* myAsync(num) {
  const num1 = yield fn(num);
  console.log(num1); // 2
  const num2 = yield fn(num1);
  console.log(num2); // 3
  const num3 = yield fn(num2);
  console.log(num3); // 4
  return num3;
}

function syncCallYield(fn, fnArg) {
  const gen = fn(fnArg);
  /**
   * 递归函数, 可以想像递归的部分就是循环调用 next 函数
   * 递归条件就是 结果的 done 属性是否是 true
   */
  function yieldCb(args = undefined) {
    const res = gen.next(args);
    if (res.value instanceof Promise) {
      return res.value.then((r) => {
        if (res.done) {
          return res;
        }
        return yieldCb(r);
      });
    }
    if (res.done) {
      return Promise.resolve(res.value);
    }
    return yieldCb(res.value);
  }

  return yieldCb();
}

const asyncRes = syncCallYield(myAsync, 1);
console.log(asyncRes); // Promise
asyncRes.then((res) => console.log(res));
```
