const middleWare = [];

let mw1 = async function (ctx, next) {
  console.log("next前, 第一个中间件");
  await next();
  console.log("next后, 第一个中间件");
};
let mw2 = async function (ctx, next) {
  console.log("next前, 第二个中间件");
  await next();
  console.log("next后, 第二个中间件");
};
let mw3 = async function (ctx, next) {
  console.log("第三个中间件, 没有next了");
};

function use(fn) {
  middleWare.push(fn);
}

// 函数收集
use(mw1);
use(mw2);
use(mw3);

function fn(ctx) {
  dispatch(0);
  function dispatch(n) {
    const f = middleWare[n];
    if (!f) {
      return Promise.resolve();
    }
    return f(ctx, dispatch.bind(null, n + 1));
  }
}

fn({});
// 输出
// next前, 第一个中间件
// next前, 第二个中间件
// 第三个中间件, 没有next了
// next后, 第二个中间件
// next后, 第一个中间件
