/**
 * 1. 新建一个用于返回的对象 res
 * 2. 将 res 的 __proto__ 指向 fn 的原型
 * 3. 将 fn 的 this 指向 res 并运行 fn, 并记录返回值 fnRes
 * 4. 若 fnRes 不是 null 且 fnRes 是函数或者对象, 则返回 fnRes, 否则直接返回空对象
 */

function fn1(a) {
  this.a = a;
  this.b = this.a + this.a;
  return this;
}

function fn2(a) {
  return { a, b: "b" };
}

function fn3(a) {
  return 1;
}

function fn4(a) {
  return null;
}

console.log(new fn1("a"));
console.log(new fn2("a"));
console.log(new fn3("a"));
console.log(new fn4("a"));

function mynew(fn, ...args) {
  const ori = Object.create(fn.prototype);

  const fnRes = fn.call(ori, ...args)
  
  const res =
    ((typeof fnRes === "object" && fnRes !== null) || typeof fnRes === "function") ? fnRes : ori;

  return res;
}

console.log(mynew(fn1, "a"));
console.log(mynew(fn2, "a"));
console.log(mynew(fn3, "a"));
console.log(mynew(fn4, "a"));
