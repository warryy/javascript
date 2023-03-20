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
        cb(that.value);
      });
    }
  }

  function reject(reason) {
    if (that.state === PENDING) {
      that.state = REJECTED;
      that.reason = reason;

      that.onRejectedCallbacks.forEach((cb) => {
        cb(that.reason);
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
 * 将 x 的值赋给 promise 的 value
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
      var called = false;
      try {
        // 这里必须要用 then.call(x, ...) 来写, x.then(...) x.then.call(x, ...) 测试用例2.3.3.1第三条就跪了, 感觉是测试用例的问题?
        then.call(
          x,
          function (r) {
            if (called) {
              return;
            }
            called = true;
            resolvePromise(promise, r, resolve, reject);
          },
          function (e) {
            if (called) {
              return;
            }
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
  // 如果onFulfilled不是函数，给一个默认函数，返回value
  // 后面返回新promise的时候也做了onFulfilled的参数检查，这里可以删除，暂时保留是为了跟规范一一对应，看得更直观
  var realOnFulfilled = onFulfilled;
  if (typeof realOnFulfilled !== "function") {
    realOnFulfilled = function (value) {
      return value;
    };
  }

  // 如果onRejected不是函数，给一个默认函数，返回reason的Error
  // 后面返回新promise的时候也做了onRejected的参数检查，这里可以删除，暂时保留是为了跟规范一一对应，看得更直观
  var realOnRejected = onRejected;
  if (typeof realOnRejected !== "function") {
    realOnRejected = function (reason) {
      throw reason;
    };
  }

  var that = this;

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
          reject(error);
        }
      }, 0);
    });
    return promise2;
  }

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
