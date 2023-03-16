/**
 * 1. promise 有状态和结果,
 * - 状态只能, 且不可多次改变: pedding -> resolved | rejected
 * - 结果可以是任何值, 初始值为 undefined, 且只能改变一次
 */
const state = '[[PromiseState]]'
const result = '[[PromiseResult]]'
class myPromise {
  constructor(resolver) {
    this[''] = 'pendding'
    this[''] = undefined
    resolver(this.#resolve.bind(this), this.#reject.bind(this))
  }
  #resolve(val) {
    if (this[state] === 'pendding') {
      this[state] = 'resolved'
      this[result] = val
    }
  }
  #reject(err) {
    if (this[state] === 'pendding') {
      this[state] = 'rejected'
      this[result] = err
      throw err
    }
  }
}
