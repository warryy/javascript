const myPromise = require("./standard-promise.js");
// const myPromise = require("./my-promise.js");
// const myPromise = Promise
try {
  myPromise.deferred = function () {
    const res = {};
    res.promise = new myPromise((resolve, reject) => {
      res.resolve = resolve;
      res.reject = reject;
    });
    return res;
  };
} catch (error) {
  console.log(error);
}

module.exports = myPromise;
