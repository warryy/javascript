// 先定义三个常量表示状态
var PENDING = "pending";
var FULFILLED = "fulfilled";
var REJECTED = "rejected";
var isFunc = function (fn) {
  return typeof fn === "function";
};

/**
 * 构造 MyPromise 函数
 * @param {初始化函数} fn
 */
function MyPromise(fn) {
  this.state = PENDING;
  this.value = null;
  this.reason = null;

  var that = this;

  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  function resolve(val) {
    if (that.state === PENDING) {
      that.state = FULFILLED;
      that.value = val;

      that.onFulfilledCallbacks.forEach((cb) => {
        cb();
      });
    }
  }

  function reject(reason) {
    if (that.state === PENDING) {
      that.state = REJECTED;
      that.reason = reason;

      that.onRejectedCallbacks.forEach((cb) => {
        cb();
      });
    }
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

/**
 * 将 x 赋值给 promise 的 value, 错误要 reject 掉, 其余要 resolve 掉
 * 1. x 和 promise 相等
 * 2. x 是 promise
 * 3. x 是 thenable 对象或者函数
 * 4. x 是基本类型
 * @param {*} promise
 * @param {*} x js 基本类型 | MyPromise | thenable 对象或函数
 * @param {*} resolve resolve 函数
 * @param {*} reject reject 函数
 * @returns void
 */
function resolvePromise(promise, x, resolve, reject) {
  // 防止死循环
  if (promise === x) {
    return reject(
      new TypeError("The promise and the return value are the same")
    );
  }
  // 如果 x 是 promise 对象
  if (x instanceof MyPromise) {
    // 如果 x 为 Promise ，则使 promise 接受 x 的状态
    // 也就是继续执行 x，如果执行的时候拿到一个 y，还要继续解析 y
    x.then(function (y) {
      resolvePromise(promise, y, resolve, reject);
    }, reject);
    return;
  }

  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    var then;
    try {
      // 把 x.then 赋值给 then
      then = x.then;
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(error);
    }

    if (typeof then === "function") {
      // 防止 x.then 手动调用两次时函数也执行两次
      var called = false;
      try {
        // 这里必须要用 then.call(x, ...) 来写, x.then(...) x.then.call(x, ...) 测试用例2.3.3.1第三条就跪了, 感觉是测试用例的问题?
        then.call(
          x,
          function (y) {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          function (e) {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
      return;
    }

    resolve(x);
    return;
  }

  resolve(x);
}

/**
 * then 原型方法实现
 * @param {promise 状态 fulfilled 时的回调函数} onFulfilled
 * @param {promise 状态 rejected 时的回调函数} onRejected
 * @returns MyPromise 对象
 */
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  var that = this;

  // 如果是 pending 状态, 需要将函数放到回调函数栈中, 待函数 resolve 时调用
  if (that.state === PENDING) {
    var promise2 = new MyPromise(function (resolve, reject) {
      // fulfilled 回调函数
      that.onFulfilledCallbacks.push(function () {
        setTimeout(function () {
          try {
            if (isFunc(onFulfilled)) {
              var x = onFulfilled(that.value);
              resolvePromise(promise2, x, resolve, reject);
            } else {
              resolve(that.value);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });

      /**
       * rejected 回调函数
       */
      that.onRejectedCallbacks.push(function () {
        setTimeout(function () {
          try {
            if (isFunc(onRejected)) {
              const x = onRejected(that.reason);
              resolvePromise(promise2, x, resolve, reject);
            } else {
              reject(that.reason);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    });

    return promise2;
  }

  // 如果已经是 fulfilled 状态的函数, 只需要直接执行 onFulfilled 函数
  if (that.state === FULFILLED) {
    var promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(() => {
        try {
          if (isFunc(onFulfilled)) {
            const x = onFulfilled(that.value);
            resolvePromise(promise2, x, resolve, reject);
          } else {
            resolve(that.value);
          }
        } catch (error) {
          // 函数已经是 fulfilled 的了, 所以出错也不能执行 onRejected 回调, 而是要将当前 promise2 的状态置为 reject
          reject(error);
        }
      }, 0);
    });
    return promise2;
  }

  // 如果已经是 rejected 状态, 则只需要直接执行 onRejected 函数
  if (that.state === REJECTED) {
    var promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          if (isFunc(onRejected)) {
            var x = onRejected(that.reason);
            resolvePromise(promise2, x, resolve, reject);
          } else {
            reject(that.reason);
          }
        } catch (error) {
          // 函数已经是 fulfilled 的了, 所以出错也不能执行 onRejected 回调, 而是要将当前 promise2 的状态置为 reject
          reject(error);
        }
      }, 0);
    });
    return promise2;
  }
};

/**
 * resolve
 */
MyPromise.resolve = function (value) {
  if (value instanceof MyPromise) {
    return value;
  }

  return new MyPromise(function (resolve) {
    resolve(value);
  });
};

/**
 * reject
 */
MyPromise.reject = function (error) {
  return new MyPromise(function (res, rej) {
    rej(error);
  });
};

/**
 * catch
 */
MyPromise.prototype.catch = function (onRejected) {
  this.then(null, onRejected);
};

/**
 * all
 * @param {promise 数组} promiseList
 * @return MyPromise 对象
 */
MyPromise.all = function (promiseList) {
  return new MyPromise((resolve, reject) => {
    var count = 0;
    var listLength = promiseList.length;
    var resList = new Array(listLength);

    if (listLength === 0) {
      return resolve(resList);
    }

    promiseList.forEach((item, idx) => {
      item.then(
        (res) => {
          count++;
          resList[idx] = res;

          if (count === listLength) {
            resolve(resList);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
};

/**
 * race
 * @param {promise 数组} promiseList
 * @return MyPromise 对象
 */
MyPromise.race = function (promiseList) {
  return new MyPromise((resolve, reject) => {
    if (listLength === 0) {
      return;
    }

    promiseList.forEach((item) => {
      item.then(
        (res) => {
          resolve(item);
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
};

/**
 * finally
 * @param {promise 状态改变回调函数} cb
 * @returns MyPromise
 */
MyPromise.prototype.finally = function (cb) {
  return this.then(
    function (res) {
      return MyPromise.resolve(cb()).then(function () {
        return res;
      });
    },
    function (reason) {
      return MyPromise.resolve(cb()).then(function () {
        throw reason;
      });
    }
  );
};

/**
 * allSettled
 * @param {promiseList} promiseList
 * @returns <Array>{ status: 状态, value: 值, reason: 错误原因 }
 */
MyPromise.allSettled = function (promiseList) {
  var count = 0;
  var length = promiseList.length;
  const res = new Array(length);

  if (length === 0) {
    return resolve(res);
  }

  return new MyPromise((resolve, reject) => {
    promiseList.forEach((promiseRes, idx) => {
      promiseRes.then(
        function (promise) {
          count++;
          res[idx] = promise;
          if (count === length) {
            resolve({
              status: FULFILLED,
              value: res,
            });
          }
        },
        function (reason) {
          count++;
          res[idx] = MyPromise.reject(reason);
          if (count === length) {
            resolve({
              status: REJECTED,
              reason: reason,
            });
          }
        }
      );
    });
  });
};

module.exports = MyPromise;
