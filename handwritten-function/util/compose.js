function add1(num) {
  return num + 1;
}
function cross2(num) {
  return num * 2;
}
function sub3(num) {
  return num - 3;
}

// 根据 args 的倒序进行计算
function compose(...args) {
    return (num) => {
        return args.reduceRight((acc, cur) => {
            return cur(acc)
        }, num)
    }
}

console.log(compose(sub3, cross2, add1)(1))