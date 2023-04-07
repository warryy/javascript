/**
 * 练手问题, 无实际用途
 * 写一个泛型 RemoveFuncLastArg<T>, 可以将 函数类型中函数入参最后一项删除掉, 即:
 * T extends (a, b, ..., q, x) => U  ===>>>  (a, b, ..., q) => U
 */

/**
 * 在元组 T 前增加 U
 */
type Prepend<T extends any[], U> = [U, ...T];
// 测试
type T1 = [boolean, string, null];
type T2 = Prepend<T1, undefined>;

/**
 * 删除元组第一项
 */
type RemoveTupleFirst<T extends any[]> = T extends [f: any, ...rest: infer Rest]
  ? Rest
  : any;

// 测试
type T3 = RemoveTupleFirst<T1>;

/**
 * 反转元组
 */
type ReverseTuple<T extends any[], U extends any[] = []> = {
  0: T extends [_0: infer First, ..._1: infer Rest]
    ? ReverseTuple<Rest, Prepend<U, First>>
    : never;
  1: U;
}[T extends [any, ...any[]] ? 0 : 1];

/**
 * 主函数
 */
type RemoveFuncLastArg<T extends (...args: any) => any> = T extends (
  ...args: infer Args
) => infer Res
  ? (...args: ReverseTuple<RemoveTupleFirst<ReverseTuple<Args>>>) => Res
  : never;

// 测试
const fn = (a: number, b: string, c: string) => ({ a, b });
let fn2: RemoveFuncLastArg<typeof fn>;

export default {};
